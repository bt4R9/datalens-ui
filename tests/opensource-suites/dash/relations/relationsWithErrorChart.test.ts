import {Page} from '@playwright/test';

import DashboardPage from '../../../page-objects/dashboard/DashboardPage';
import {openTestPage, slct} from '../../../utils';
import datalensTest from '../../../utils/playwright/globalTestDefinition';
import {DashCommonQa} from '../../../../src/shared';

import {Workbook} from '../../../page-objects/workbook/Workbook';
import {TestParametrizationConfig} from '../../../types/config';

const PARAMS = {
    UNKNOWN: 'Unspecified',
};

datalensTest.describe('Dashboards - Relations (new)', () => {
    datalensTest.afterEach(async ({page}: {page: Page}) => {
        const dashboardPage = new DashboardPage({page});
        await dashboardPage.cancelRelationsChanges();
        await dashboardPage.exitEditMode();
        await dashboardPage.deleteDash();
    });
    datalensTest(
        'Pop-up opening for chart with error and the presence of the inscription "No elements for links"',
        async ({page, config}: {page: Page; config: TestParametrizationConfig}) => {
            const workbookPO = new Workbook(page);
            await workbookPO.openE2EWorkbookPage();

            // copy the original dashboard with delayed widget loading,
            // so that the tests do not collapse due to the transition to editing and locks
            const dashboardPage = new DashboardPage({page});
            await openTestPage(page, config.dash.urls.DashboardWithErrorChart);
            await dashboardPage.duplicateDashboard(config.dash.urls.DashboardWithErrorChart);

            await dashboardPage.openControlRelationsDialog();

            await dashboardPage.waitForSelector(slct(DashCommonQa.RelationsDialogEmptyText));
        },
    );
    datalensTest(
        'Pop-up opening for chart with error and there is possibility to set ignore link',
        async ({page, config}: {page: Page; config: TestParametrizationConfig}) => {
            const workbookPO = new Workbook(page);
            await workbookPO.openE2EWorkbookPage();

            // copy the original dashboard with delayed widget loading,
            // so that the tests do not collapse due to the transition to editing and locks
            const dashboardPage = new DashboardPage({page});
            await openTestPage(page, config.dash.urls.DashboardWithAPIErrorChart);
            await dashboardPage.duplicateDashboard(config.dash.urls.DashboardWithAPIErrorChart);

            await dashboardPage.openControlRelationsDialog();

            await dashboardPage.waitForSelector(`text=${PARAMS.UNKNOWN}`);
        },
    );
});
