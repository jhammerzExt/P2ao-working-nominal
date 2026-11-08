import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { GoogleAuthProvider, onAuthStateChanged, type User } from 'firebase/auth';

// Add Google Drive scopes to provider
googleProvider.addScope('https://www.googleapis.com/auth/drive');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/**
 * Initialize Firebase Auth listener for Google Drive OAuth
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign-In with Drive Scopes
 */
export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive OAuth access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setDriveAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const signOutGoogleDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  owners?: Array<{ displayName: string; emailAddress: string }>;
  shared?: boolean;
}

/**
 * List files from Google Drive API v3
 */
export async function listDriveFiles(
  accessToken: string,
  queryStr = "trashed = false",
  pageSize = 40
): Promise<DriveFile[]> {
  const fields = 'files(id, name, mimeType, size, iconLink, webViewLink, webContentLink, createdTime, modifiedTime, owners, shared)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&pageSize=${pageSize}&fields=${encodeURIComponent(fields)}&orderBy=modifiedTime%20desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Drive API error ${response.status}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create a new text file or artifact on Google Drive
 */
export async function createDriveFile(
  accessToken: string,
  name: string,
  content: string,
  mimeType = 'text/plain'
): Promise<DriveFile> {
  const metadata = {
    name,
    mimeType
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create file in Google Drive (${response.status})`);
  }

  return response.json();
}

/**
 * Delete a file from Google Drive (Requires user confirmation before invoking!)
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete file from Google Drive (${response.status})`);
  }

  return true;
}

/**
 * Read text content from a Google Drive file
 */
export async function readDriveFileContent(accessToken: string, fileId: string): Promise<string> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to read file content (${response.status})`);
  }

  return response.text();
}
