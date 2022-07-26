import { useMemo } from 'react';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import {
  BlobItem,
  BlobPrefix,
  BlobServiceClient,
  ContainerListBlobFlatSegmentResponse,
} from '@azure/storage-blob';
import { nanoid } from './utils/nanoid';

type BlobItemType =
  | BlobItem
  | (BlobPrefix & { kind: 'prefix' })
  | (BlobItem & { kind: 'blob' });

type Props = {
  account: string;
  token: string;
  container: string;
};

export function useAzureStorage({ account, token, container }: Props) {
  const containerClient = useMemo(() => {
    const sasURL = `https://${account}.blob.core.windows.net${token}`;
    const blobServiceClient = new BlobServiceClient(sasURL);
    return blobServiceClient.getContainerClient(container);
  }, [account, token, container]);

  const blobsToArray = async (
    blobs: PagedAsyncIterableIterator<
      BlobItemType,
      ContainerListBlobFlatSegmentResponse
    >
  ): Promise<BlobItemType[]> => {
    const files: BlobItemType[] = [];
    for await (const blob of blobs) {
      files.push(blob);
    }
    return files;
  };

  const listAllFiles = async () => {
    const blobs = containerClient.listBlobsFlat();
    const files = blobsToArray(blobs);
    return files;
  };

  const listFiles = async (prefix?: string) => {
    const blobs = prefix
      ? containerClient.listBlobsByHierarchy('/', { prefix })
      : containerClient.listBlobsFlat();

    const files = blobsToArray(blobs);
    return files;
  };

  const uploadFiles = async (files: File[]) => {
    const promises = files.map(async file => {
      const ext = '.' + file.name.split('.').pop();
      const name = nanoid() + ext;
      const blockBlobClient = containerClient.getBlockBlobClient(name);
      const res = await blockBlobClient.uploadData(file);
      return { ...res, name };
    });

    const result = await Promise.all(promises);
    return result;
  };

  return { listAllFiles, listFiles, uploadFiles };
}
