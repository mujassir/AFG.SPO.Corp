import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SliderWidgetWebPartStrings';
import SliderWidget from './components/SliderWidget';
import { ISliderWidgetProps } from './components/ISliderWidgetProps';
import { sp } from '@pnp/sp';

export interface ISliderWidgetWebPartProps {
  context: any;
  listName: string;
  height: string;
  width: string;
}

export default class SliderWidgetWebPart extends BaseClientSideWebPart<ISliderWidgetWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<ISliderWidgetProps> = React.createElement(
      SliderWidget,
      {
        context: this.context,
        listName: this.properties.listName,
        height: this.properties.height,
        width: this.properties.width
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                }),
                PropertyPaneTextField('height', {
                  label: strings.HeightFieldLabel
                }),
                PropertyPaneTextField('width', {
                  label: strings.WidthFieldLabel
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
