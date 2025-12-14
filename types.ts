export interface Source {
  title: string;
  uri: string;
}

export interface GeneratedContent {
  htmlContent: string;
  sources: Source[];
  topic: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
