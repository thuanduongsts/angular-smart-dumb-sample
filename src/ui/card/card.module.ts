import { NgModule } from '@angular/core';

import { CardHeaderComponent } from '../card/card-header/card-header.component';
import { CardTitleComponent } from './card-header/card-title/card-title.component';
import { CardSubTitleComponent } from './card-header/card-sub-title/card-sub-title.component';
import { CardContentComponent } from './card-content/card-content.component';
import { CardFooterComponent } from './card-footer/card-footer.component';
import { CardComponent } from './card.component';

@NgModule({
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubTitleComponent,
    CardContentComponent,
    CardFooterComponent
  ],
  exports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubTitleComponent,
    CardContentComponent,
    CardFooterComponent
  ]
})
export class CardModule {}
