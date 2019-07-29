import helper from 'tipsi-appium-helper'
import test from './utils/tape'

const { driver, idFromAccessId, platform } = helper

const waitForVisible = async ({ selector, timeout = 1000 }) => {
  try {
    const element = await driver.$(selector)
    await element.waitForDisplayed(timeout)
    return true
  } catch (e) {
    console.log(`Error [waitForVisible]: ${e.message}`)
    return false
  }
}

const waitForClick = async ({ selector, timeout = 1000 }) => {
  try {
    const element = await driver.$(selector)
    await element.waitForDisplayed(timeout)
    await element.click()
    return true
  } catch (e) {
    console.log(`Error [waitForClick]: ${e.message}`)
    return false
  }
}

const haveText = async ({ selector, expectedText = '' }) => {
  try {
    const element = await driver.$(selector)
    const text = await element.getText()
    return text === `${expectedText}`
  } catch (e) {
    console.log(`Error [haveText]: ${e.message}`)
    return false
  }
}

test('Router', async (t) => {
  const homeScreenId = idFromAccessId('Home')
  const pushButtonId = idFromAccessId('Push')
  const replaceButtonId = idFromAccessId('Replace')
  const modalButtonId = idFromAccessId('Modal')
  const backButtonId = idFromAccessId('backButton')

  t.ok(
    await waitForVisible({ selector: homeScreenId, timeout: 120000 }),
    'User should see Home screen'
  )

  t.ok(
    await waitForClick({ selector: pushButtonId, timeout: 10000 }),
    'User should be able tap on push button'
  )

  let detailsTextId = idFromAccessId('pushDetailsText')
  t.ok(
    await waitForVisible({ selector: detailsTextId, timeout: 10000 }),
    'Details screen should be visible'
  )

  t.ok(
    await haveText({ selector: detailsTextId, expectedText: 'Push details' }),
    'Details text as expected'
  )

  t.ok(
    await waitForClick({ selector: replaceButtonId, timeout: 3000 }),
    'User should be able tap on push replace button'
  )

  detailsTextId = idFromAccessId('replaceDetailsText')
  t.ok(
    await waitForVisible({ selector: detailsTextId, timeout: 10000 }),
    'Details screen should be replaced'
  )

  t.ok(
    await haveText({ selector: detailsTextId, expectedText: 'Replaced' }),
    'Details text as expected'
  )

  t.ok(
    await waitForClick({ selector: backButtonId }),
    'User should click back button'
  )

  t.ok(
    await waitForVisible({ selector: homeScreenId, timeout: 60000 }),
    'User should see Home screen'
  )

  t.ok(
    await waitForClick({ selector: modalButtonId }),
    'User should open modal'
  )

  detailsTextId = idFromAccessId('modalDetailsText')
  t.ok(
    await waitForVisible({ selector: detailsTextId, timeout: 10000 }),
    'Details screen as modal should be visible'
  )

  t.ok(
    await haveText({ selector: detailsTextId, expectedText: 'Modal details' }),
    'Details text as expected'
  )

  t.ok(
    await waitForClick({ selector: backButtonId }),
    'User should click back button'
  )

  t.ok(
    await waitForVisible({ selector: homeScreenId, timeout: 60000 }),
    'User should see Home screen'
  )

  if (platform('android')) {
    t.ok(
      await waitForClick({ selector: modalButtonId }),
      'User should open modal'
    )

    t.ok(
      await waitForVisible({ selector: detailsTextId, timeout: 10000 }),
      'Modal details screen should be visible'
    )

    // Send android hardware back button press
    await driver.sendKeyEvent('4')
  }
})
