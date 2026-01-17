import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Medication {
  id: number;
  name: string;
  noPos: boolean;
}

export interface CreateRequestDto {
  medicationId: number;
  orderNumber?: string;
  address?: string;
  phone?: string;
  contactEmail?: string;
}

export interface RequestListItemDto {
  id: number;
  medicationName: string;
  noPos: boolean;
  createdAt: string;
  orderNumber?: string;
  address?: string;
  phone?: string;
  contactEmail?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(private http: HttpClient) {}

  listMedications() {
    return this.http.get<Medication[]>(`${environment.requestsApi}/medications`);
  }

  createRequest(dto: CreateRequestDto) {
    return this.http.post<void>(`${environment.requestsApi}/requests`, dto);
  }

  listRequests(page = 0, size = 10) {
    return this.http.get<PageResponse<RequestListItemDto>>(
      `${environment.requestsApi}/requests?page=${page}&size=${size}`
    );
  }
}
