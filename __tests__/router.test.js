import React, { Component } from 'react'
import { mount } from 'enzyme'
import Router, { createStackNavigation, addInterceptor } from '../'

function DummyComponent(name) {
  return class extends Component {
    static displayName = name

    render() {
      return (
        <div>{this.props.children}</div>
      )
    }
  }
}

// const routes = {
//   home: {
//     path: '/',
//     component: DummyComponent('Home'),
//   },
//   about: {
//     path: '/about',
//     component: DummyComponent('About'),
//   },
//   details: {
//     path: '/details',
//     component: DummyComponent('Details'),
//   },
//   exact: {
//     path: '/exact',
//     component: DummyComponent('Exact'),
//     exact: true,
//   },
// }

const routes = [
  {
    Route: DummyComponent('Home'),
    path: '/',
    children: [
      {
        path: 'about',
        Route: DummyComponent('About'),
      },
      {
        path: 'details',
        Route: DummyComponent('Details'),
      },
      {
        path: 'exact',
        Route: DummyComponent('Exact'),
      },
    ]
  },
]

describe('Router without interceptors', () => {
  const wrapper = mount(createStackNavigation('/', routes, true))

  test('Push', async () => {
    await Router.push(null, { path: '/about' }, { goToProps: true })
    expect(Router.getCurrentRoute()).toEqual('/about')

    wrapper.update()
    console.log(wrapper.find('About'))
    // expect(wrapper.find('About').prop('goToProps')).toBe(true)
    // expect(wrapper.find('About').prop('location').state.goToProps).toBe(true)
  })

  // test('Pop', () => {
  //   Router.pop()
  //   expect(Router.getCurrentRoute()).toEqual('/')
  // })

  // test('Replace', () => {
  //   Router.push(null, Router.routes.about)
  //   Router.replace(null, Router.routes.details)
  //   expect(Router.getCurrentRoute()).toEqual('/details')
  // })

  // test('popToTop', () => {
  //   Router.push(null, Router.routes.about)
  //   Router.popToTop(null)
  //   expect(Router.getCurrentRoute()).toEqual('/')
  // })

  // test('showModal', () => {
  //   spyOn(Router, 'showModal')
  //   Router.showModal()
  //   expect(Router.showModal).toHaveBeenCalled()
  // })

  // test('dismissModal', () => {
  //   spyOn(Router, 'dismissModal')
  //   Router.dismissModal()
  //   expect(Router.dismissModal).toHaveBeenCalled()
  // })

  // test('ExactPath', () => {
  //   Router.push(null, Router.routes.exact)
  //   wrapper.update()
  //   expect(Router.getCurrentRoute()).toEqual('/exact')
  //   expect(
  //     wrapper.findWhere(child => child.prop('path') === Router.routes.exact.path).prop('exact')
  //   ).toEqual(true)
  // })

  // test('ExactRootPath', () => {
  //   Router.push(null, Router.routes.home)
  //   wrapper.update()
  //   expect(Router.getCurrentRoute()).toEqual('/')
  //   expect(
  //     wrapper.findWhere(child => child.prop('path') === Router.routes.home.path).prop('exact')
  //   ).toEqual(true)
  // })

  // test('NotExactPath', () => {
  //   Router.push(null, Router.routes.about)
  //   wrapper.update()
  //   expect(Router.getCurrentRoute()).toEqual('/about')
  //   expect(
  //     wrapper.findWhere(child => child.prop('path') === Router.routes.about.path).prop('exact')
  //   ).toEqual(false)
  // })

  // test('Push with location-like argument', () => {
  //   const query = { the: 'query' }
  //   Router.push(null, {
  //     ...Router.routes.about,
  //     query,
  //   })
  //   wrapper.update()
  //   expect(Router.getCurrentRoute()).toEqual('/about')
  //   // expect(Router.getCurrentQuery()).toEqual(query)
  // })
})


// describe('Router with interceptors', () => {
//   createStackNavigation('/', routes, true)

//   const mock = jest.fn() // eslint-disable-line async no-undef
//   const interceptor = (args) => {
//     mock(args)
//     return args
//   }

//   addInterceptor(interceptor)

//   test('Push', () => {
//     Router.push(null, Router.routes.about, { goToProps: true })
//     expect(mock).toHaveBeenCalledWith({
//       method: 'push',
//       args: [
//         null,
//         Router.routes.about,
//         { goToProps: true },
//       ],
//     })
//   })

//   test('Pop', () => {
//     Router.pop()
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'pop',
//       args: [],
//     })
//   })

//   test('Replace', () => {
//     Router.push(null, Router.routes.about)
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'push',
//       args: [
//         null,
//         Router.routes.about,
//       ],
//     })

//     Router.replace(null, Router.routes.details)
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'replace',
//       args: [
//         null,
//         Router.routes.details,
//       ],
//     })
//   })

//   test('popToTop', () => {
//     Router.push(null, Router.routes.about)
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'push',
//       args: [
//         null,
//         Router.routes.about,
//       ],
//     })

//     Router.popToTop(null)
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'popToTop',
//       args: [null],
//     })
//   })

//   test('showModal', () => {
//     Router.showModal()
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'showModal',
//       args: [],
//     })
//   })

//   test('dismissModal', () => {
//     Router.dismissModal()
//     expect(mock).toHaveBeenLastCalledWith({
//       method: 'dismissModal',
//       args: [],
//     })
//   })
// })
