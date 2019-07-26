import { mount } from 'enzyme'
import routes from './setup/routes'
import Router, { createStackNavigation } from '..'


describe('Router should scroll up after route change', () => {
  const wrapper = mount(createStackNavigation('/', routes, true, {}))

  test('scrollToTop after redirect', () => {
    const scrollToTop = jest.fn()
    global.scrollTo = scrollToTop

    Router.push(null, Router.routes.home)
    wrapper.update()

    Router.push(null, Router.routes.about)
    wrapper.update()

    setTimeout(() => {
      expect(scrollToTop).toHaveBeenCalled()
    })

    Router.pop()
    wrapper.update()

    setTimeout(() => {
      expect(scrollToTop).toHaveBeenCalled()
    })
  })
})
