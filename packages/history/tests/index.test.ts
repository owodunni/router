import { describe, expect, it } from 'vitest'
import { createHashHistory } from '../src/index'

const createWindow: () => {
  addEventListener: Window['addEventListener']
  location: Window['location']
  history: Window['history']
} = () => ({
  location: {
    ancestorOrigins: undefined as unknown as DOMStringList,
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
    assign: function (): void {
      throw new Error('Function not implemented.')
    },
    reload: function (): void {
      throw new Error('Function not implemented.')
    },
    replace: function (): void {
      throw new Error('Function not implemented.')
    },
  },
  history: {
    length: 0,
    scrollRestoration: 'auto',
    state: undefined,
    back: function (): void {
      throw new Error('Function not implemented.')
    },
    forward: function (): void {
      throw new Error('Function not implemented.')
    },
    go: function (): void {
      throw new Error('Function not implemented.')
    },
    pushState: function (): void {
      throw new Error('Function not implemented.')
    },
    replaceState: function (): void {
      /* No-op */
    },
  },
  addEventListener: () => {
    /* No-op */
  },
})

describe('createHashHistory', () => {
  it('should read and write query parameters', () => {
    const win = createWindow()

    win.location.search = '?hello=world'
    win.location.hash = '#/some/route'
    const history = createHashHistory({ window: win })
    expect(history.location.href).toBe('/some/route?hello=world')
    expect(history.location.pathname).toBe('/some/route')
    expect(history.location.search).toBe('?hello=world')

    history.replace('/other/route?other=query')

    expect(history.location.href).toBe('/other/route?other=query')
    expect(history.location.search).toBe('?other=query')

    history.replace('/other/route/2')

    expect(history.location.href).toBe('/other/route/2')
    expect(history.location.search).toBe('')

    history.replace('/other/route/2?real=query#/some/hash?false=query')

    expect(history.location.href).toBe(
      '/other/route/2?real=query#/some/hash?false=query',
    )
    expect(history.location.search).toBe('?real=query')
  })

  it('should respect query parameters in hash route', () => {
    const win = createWindow()
    win.location.href = '/#/some/route?other=parameters'
    win.location.search = ''
    win.location.hash = '#/some/route?other=parameters'
    const history = createHashHistory({ window: win })
    expect(history.location.href).toBe('/some/route?other=parameters')
    expect(history.location.pathname).toBe('/some/route')
    expect(history.location.search).toBe('?other=parameters')
  })

  it('should merge query parameters in hash route', () => {
    const win = createWindow()
    win.location.href = '/?hello=world#/some/route?other=parameters'
    win.location.search = '?hello=world'
    win.location.hash = '#/some/route?other=parameters'
    const history = createHashHistory({ window: win })
    expect(history.location.href).toBe(
      '/some/route?hello=world&other=parameters',
    )
    expect(history.location.pathname).toBe('/some/route')
    expect(history.location.search).toBe('?hello=world&other=parameters')
  })
})
