import { notFound } from 'next/navigation';
import { ApiNotFoundError } from './api';

export async function requiredData<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }
}
