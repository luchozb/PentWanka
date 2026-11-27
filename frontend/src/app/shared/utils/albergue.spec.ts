import { resolverAlbergueId } from './albergue';

describe('resolverAlbergueId', () => {
  it('resuelve Huellitas del Mantaro como alb-1', () => {
    expect(resolverAlbergueId('Huellitas del Mantaro')).toBe('alb-1');
  });

  it('resuelve 4 Patas Chilca como alb-2', () => {
    expect(resolverAlbergueId('Refugio Amigos de 4 Patas Chilca')).toBe('alb-2');
  });

  it('usa alb-1 cuando no hay nombre', () => {
    expect(resolverAlbergueId(undefined)).toBe('alb-1');
  });
});
