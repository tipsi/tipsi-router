import helper from 'tipsi-appium-helper'
import test from './utils/tape'

const { driver, idFromAccessId, platform } = helper

test('Router', async (t) => {
  const homeScreenId = idFromAccessId('Home')
  const pushButtonId = idFromAccessId('Push')
  const replaceButtonId = idFromAccessId('Replace')
  const modalButtonId = idFromAccessId('Modal')
  const backButtonId = idFromAccessId('backButton')

  await driver.waitForVisible(homeScreenId, 120000)
  t.pass('User should see Home screen')

  await driver.waitForVisible(pushButtonId, 10000).click(pushButtonId)
  t.pass('User should be able tap on push button')

  let detailsTextId = idFromAccessId('pushDetailsText')
  await driver.waitForVisible(detailsTextId, 10000)
  t.pass('Details screen should be visible')

  let screenText = await driver.getText(detailsTextId)
  t.equal(screenText, 'Push details', 'Details text as expected')

  await driver.waitForVisible(replaceButtonId, 3000).click(replaceButtonId)

  detailsTextId = idFromAccessId('replaceDetailsText')
  await driver.waitForVisible(detailsTextId, 10000)
  t.pass('Details screen should be replaced')

  screenText = await driver.getText(detailsTextId)
  t.equal(screenText, 'Replaced', 'Details text as expected')

  await driver.click(backButtonId)
  t.pass('User should click back button')

  await driver.waitForVisible(homeScreenId, 60000)
  t.pass('User should see Home screen')

  await driver.click(modalButtonId)
  t.pass('User should open modal')

  detailsTextId = idFromAccessId('modalDetailsText')
  await driver.waitForVisible(detailsTextId, 10000)
  t.pass('Details screen as modal should be visible')

  screenText = await driver.getText(detailsTextId)
  t.equal(screenText, 'Modal details', 'Details text as expected')

  await driver.click(backButtonId)
  t.pass('User should click back button')

  await driver.waitForVisible(homeScreenId, 60000)
  t.pass('User should see Home screen')

  if (platform('android')) {
    await driver.click(modalButtonId)

    await driver.waitForVisible(detailsTextId, 10000)
    t.pass('Modal details screen should be visible')

    // Send android hardware back button press
    await driver.deviceKeyEvent(4)
  }
})
