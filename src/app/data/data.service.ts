import { Injectable } from '@angular/core';

import { MockData, MOCK_DATA } from './mock.data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getData(): MockData {
    return MOCK_DATA;
  }
}
