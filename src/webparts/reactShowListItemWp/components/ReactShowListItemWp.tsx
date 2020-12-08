import * as React from 'react';
import styles from './ReactShowListItemWp.module.scss';
import { IReactShowListItemWpProps } from './IReactShowListItemWpProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as jquery from 'jquery';

export interface IReactShowListItemWpState {
  listItems: [
    {
      "Title": "",
      "ID": "",
      "Model": ""
    }
  ]
}

export default class ReactShowListItemWp extends React.Component<IReactShowListItemWpProps, IReactShowListItemWpState> {

  static siteUrl: string = "";
  public constructor(props: IReactShowListItemWpProps, state: IReactShowListItemWpState) {
    super(props);
    this.state = {
      listItems: [
        {
          "Title": "",
          "ID": "",
          "Model": ""
        }
      ]
    };
    ReactShowListItemWp.siteUrl = this.props.websiteUrl;
  }

  public componentDidMount() {

    // This reference is important because inside jquery.ajax function we will not get reference to react state
    // we will not be able to call setState. So reactContextHandler is created so that setState can be called
    let reactContextHandler = this;

    jquery.ajax({
      url: `${ReactShowListItemWp.siteUrl}/_api/web/lists/getbytitle('MySampleList')/items`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactContextHandler.setState({
          listItems: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {

      }
    });
  }

  public render(): React.ReactElement<IReactShowListItemWpProps> {
    return (
      <div className={ styles.reactShowListItemWp }>
        <table className={styles.row}>
          {
            this.state.listItems.map(function(listItem, listItemKey){
              let fullUrl: string = `${ReactShowListItemWp.siteUrl}/lists/MySampleList/DispForm.aspx?ID=${listItem.ID}`;
              return(
                <tr>
                  <td>
                    <a className={styles.label} href={fullUrl}>
                      {listItem.Title}
                    </a>
                  </td>
                  <td className={styles.label}>
                    {listItem.ID}
                  </td>
                  <td className={styles.label}>
                    {listItem.Model}
                  </td>
                </tr>
              );
            })
          }
        </table>

        <ol>
          {
            this.state.listItems.map(function(listItem, listItemKey){
              let fullUrl: string = `${ReactShowListItemWp.siteUrl}/lists/MySampleList/DispForm.aspx?ID=${listItem.ID}`;
              return(
                <li>
                  <a className={styles.label} href={fullUrl}>
                    <span>{listItem.Title}</span>,<span>{listItem.ID}</span>,<span>{listItem.Model}</span>
                  </a>
                </li>
              );
            })
          }
        </ol>
      </div>
    );
  }
}
