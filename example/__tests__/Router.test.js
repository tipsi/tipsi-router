import helper from 'tipsi-appium-helper'
import test from './utils/tape'

const { driver, idFromAccessId, platform } = helper

test('Router', async (t) => {
  const homeScreenId = idFromAccessId('Home')
  const pushId = idFromAccessId('Push')
  const modalId = idFromAccessId('Modal')
  const replaceId = idFromAccessId('Replace')
  const detailsTextId = idFromAccessId('detailsText')
  const backButtonId = idFromAccessId('backButton')

  await driver.waitForVisible(homeScreenId, 30000)
  t.pass('User should see Home screen')

  await driver.waitForVisible(pushId, 10000)
  await driver.click(pushId)
  t.pass('User should be able tap on push button')

  await driver.waitForVisible(detailsTextId, 10000)
  t.pass('Details screen should be visible')

  t.equal(await driver.getText(detailsTextId), 'Push details', 'Details text as expected')

  await driver.waitForVisible(replaceId, 3000)
  await driver.click(replaceId)

  await driver.waitForVisible(detailsTextId, 10000)
  t.equal(await driver.getText(detailsTextId), 'Replaced', 'Details text as expected')

  await driver.click(backButtonId)

  await driver.waitForVisible(homeScreenId, 30000)
  t.pass('User should see Home screen')

  await driver.click(modalId)

  await driver.waitForVisible(detailsTextId, 10000)
  t.pass('Modal details screen should be visible')

  await driver.waitForVisible(detailsTextId, 10000)
  t.equal(await driver.getText(detailsTextId), 'Modal details', 'Details text as expected')

  await driver.click(backButtonId)

  await driver.waitForVisible(homeScreenId, 30000)
  t.pass('User should see Home screen')

  if (platform('android')) {
    await driver.click(modalId)

    await driver.waitForVisible(detailsTextId, 10000)
    t.pass('Modal details screen should be visible')
    // send android hardware back button press
    await driver.deviceKeyEvent(4)
  }
})
