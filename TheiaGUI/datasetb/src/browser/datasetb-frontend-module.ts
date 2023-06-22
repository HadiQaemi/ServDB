import { ContainerModule } from '@theia/core/shared/inversify';
import { DatasetbWidget } from './datasetb-widget';
import { DatasetbContribution } from './datasetb-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, DatasetbContribution);
    bind(FrontendApplicationContribution).toService(DatasetbContribution);
    bind(DatasetbWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: DatasetbWidget.ID,
        createWidget: () => ctx.container.get<DatasetbWidget>(DatasetbWidget)
    })).inSingletonScope();
});
