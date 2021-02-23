import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import ISliderImage from "../models/ISliderImage";

export default class ListDataManager {

  public static async getSliderWidgetData(
    listName: string
  ): Promise<ISliderImage[]> {
    let list = sp.web.lists.getByTitle(listName).items;
    const items: any[] = await list.get();
    console.log("items;", items);
    let results: ISliderImage[] = items.map((p: any) => {
      return {
        Title: p.Title,
        ImageURL: p.ImageURL,
        Target: p.Target,
        DisplayOrder: p.DisplayOrder
      };
    });
    console.log("getSliderWidgetData", results);
    return results;
  }

  private static getLinkURL(link: any): string {
    return link ? link.Url : undefined;
  }

  private static getEditURL(siteURL: string, listName: string, id: string): string {
    listName = listName.split(' ').join('');
    return `${siteURL}/Lists/${listName}/DispForm.aspx?ID=${id}`;
  }

  private static getViewURL(id: string, listName: string): string {
    return `${window.location.origin}/Lists/${listName}/DispForm.aspx?ID=${id}`;
  }

  private static getPictureURL(picture: any): string {
    picture = JSON.parse(picture);
    return picture.serverUrl + picture.serverRelativeUrl;
  }
}
