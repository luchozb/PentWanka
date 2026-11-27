import { PLATFORM_ID, type EnvironmentProviders, type Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, type Params } from '@angular/router';
import { of } from 'rxjs';

export const testProviders: (Provider | EnvironmentProviders)[] = [
  { provide: PLATFORM_ID, useValue: 'browser' },
  provideRouter([]),
  provideHttpClient(),
  provideHttpClientTesting()
];

export function rutaConParametros(params: Params = {}, queryParams: Params = {}): Provider {
  const paramMap = convertToParamMap(params);
  const queryParamMap = convertToParamMap(queryParams);

  return {
    provide: ActivatedRoute,
    useValue: {
      snapshot: { paramMap, queryParamMap },
      paramMap: of(paramMap),
      queryParamMap: of(queryParamMap)
    }
  };
}
