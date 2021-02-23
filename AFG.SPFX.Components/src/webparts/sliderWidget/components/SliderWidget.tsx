import * as React from 'react';
import Loader from 'react-loader-spinner';     //https://www.npmjs.com/package/react-loader-spinner
import styles from './SliderWidget.module.scss';
import { ISliderWidgetProps } from './ISliderWidgetProps';
import {
  Carousel,
  CarouselButtonsDisplay,
  CarouselButtonsLocation,
  CarouselIndicatorShape
} from "@pnp/spfx-controls-react/lib/Carousel";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import ISliderImage from '../models/ISliderImage';
import ListDataManager from '../managers/list.data.manager';
import Constants from '../common/constants';
import { IDictionary, ISerializableObject } from 'office-ui-fabric-react/lib/Utilities';

export default class SliderWidget extends React.Component<ISliderWidgetProps, {}> {

  public state = {
    isLoading: false,
    hasErrors: false,
    errors: null,
    sliderImages: null
  };
  public async componentDidMount() {

    if (this.props.listName) {
      this.loadDataFromSPOList(this.props.listName);
    }
  }

  private async loadDataFromSPOList(listName: string) {
    this.setState({
      isLoading: true,
      hasErrors: false,
    });

    try {
      let list = await ListDataManager.getSliderWidgetData(listName);
      let carouselEvements = list.map((p: ISliderImage) => {
        return {
          imageSrc: p.ImageURL,
          title: p.Title,
          url: p.Target,
          showDetailsOnHover: true,
          imageFit: ImageFit.cover
        };
      });
      this.setState({
        isLoading: false,
        sliderImages: carouselEvements
      }, () => {
        this.setWidgetHeightWidth();
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        hasErrors: true,
        errors: Constants.Errors.ListError,
      });
    }



  }


  public render(): React.ReactElement<ISliderWidgetProps> {
    return (
      this.props.listName ? this.renderWidget() : this.renderPlaceHolder()
    );
  }
  private renderWidget(): React.ReactElement<ISliderWidgetProps> {
    return (
      this.state.isLoading
        ? this.renderLoader()
        : this.renderWidgetWithErrorCheck()

    );
  }

  private renderWidgetWithErrorCheck() {
    return (
      this.state.hasErrors ? this.renderError() : this.renderWidgetSlider()
    );
  }

  private renderError() {
    return (
      <div className={styles.error}>{this.state.errors}</div>
    );
  }

  private renderWidgetSlider() {
    return (
      <div className={styles.sliderWidget} style={{ margin: 'auto',width: this.getWidgetWidth()}} >
        {this.state.sliderImages
          ?
          <Carousel
            buttonsLocation={CarouselButtonsLocation.center}
            buttonsDisplay={CarouselButtonsDisplay.buttonsOnly}
            contentContainerStyles={styles.carouselImageContent}
            isInfinite={true}
            indicatorShape={CarouselIndicatorShape.circle}
            pauseOnHover={true}
            canMoveNext={true}
            canMovePrev={true}
            element={this.state.sliderImages}
            onMoveNextClicked={(index: number) => { console.log(`Next button clicked: ${index}`); }}
            onMovePrevClicked={(index: number) => { console.log(`Prev button clicked: ${index}`); }}
          />
          :
          <div style={{ textAlign: 'center' }}>
            No image(s) found
      </div>
        }
      </div>
    );

  }

  private renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader
          type={Constants.Defaults.Loader.type}
          color={Constants.Defaults.Loader.color}
          height={Constants.Defaults.Loader.height}
          width={Constants.Defaults.Loader.width}
        />
      </div>
    );
  }

  private getWidgetHeight() {
    return this.props.height || Constants.Defaults.SliderWidget.height;
  }
  private getWidgetWidth() {
    return this.props.width || Constants.Defaults.SliderWidget.width;
  }
  private setWidgetHeightWidth() {
    let element = document.getElementsByClassName(styles.carouselImageContent);
    element[0].setAttribute("style", `height: ${this.getWidgetHeight()}`);
  }

  private renderPlaceHolder() {
    return (
      <Placeholder iconName='Edit'
        iconText='Configure your web part'
        description='Please configure the web part.'
        buttonLabel='Configure'
        onConfigure={this._onConfigure} />
    );
  }


  private _onConfigure = () => {
    // Context of the web part
    this.props.context.propertyPane.open();
  }
}
