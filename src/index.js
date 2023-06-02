import { make } from "@groupher/editor-utils";
/**
 * Build styles
 */
import css from "./styles/index.css";
import { MODE } from "./constant";

import RowModeIcon from "./icon/row_mode.svg";
import ColumnModeIcon from "./icon/column_mode.svg";

import UI from "./ui/index";
import { isValidData } from "./helper";

/**
 * Collapse Block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */

/**
 * @typedef {Object} DelimiterData
 * @description Tool's input and output data format
 */
export default class Collapse {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: DelimiterData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    const defaultData = {
      mode: MODE.ROW,
      title: "",
      content: "",
    };

    this._data = isValidData(data) ? data : defaultData;

    this.ui = new UI({
      data: this._data,
      api,
      setData: this.setData.bind(this),
    });

    this.element = null;
  }

  setData(data) {
    this._data = { ...this._data, ...data };
  }

  /**
   * Allow to press Enter inside the Header input
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return false;
  }

  /**
   * @return {object} - Collapse Tool styles
   * @constructor
   */
  get CSS() {
    return {
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    this.element = this.ui.drawView(this._data);
    return this.element;
  }

  /**
   * reRender based on new data
   * @public
   *
   * @return {HTMLDivElement}
   */
  reRender() {
    this.replaceElement(this.ui.drawView(this._data));
  }

  /**
   * replace element wrapper with new html element
   * @param {HTMLElement} node
   */
  replaceElement(node) {
    this.element.replaceWith(node);
    this.element = node;

    this.api.tooltip.hide();
    this.api.toolbar.close();
  }

  /**
   * render Setting buttons
   * @public
   */
  // renderSettings() {
  //   const Wrapper = make("div");

  //   const settings = [
  //     {
  //       title: "展开模式",
  //       action: MODE.ROW,
  //       icon: RowModeIcon,
  //     },
  //     {
  //       title: "预览模式",
  //       action: MODE.COLUMN,
  //       icon: ColumnModeIcon,
  //     },
  //   ];

  //   settings.forEach((item) => {
  //     const itemEl = make("div", this.CSS.settingsButton, {
  //       innerHTML: item.icon,
  //     });

  //     if (item.action === MODE.ROW) {
  //       this._data.mode === MODE.ROW
  //         ? itemEl.classList.add(this.CSS.settingsButtonActive)
  //         : itemEl.classList.remove(this.CSS.settingsButtonActive);
  //     } else {
  //       this._data.mode === MODE.COLUMN
  //         ? itemEl.classList.add(this.CSS.settingsButtonActive)
  //         : itemEl.classList.remove(this.CSS.settingsButtonActive);
  //     }

  //     itemEl.addEventListener("click", () => {
  //       this._data.mode = item.action;
  //       this.reRender(this._data);
  //     });

  //     this.api.tooltip.onHover(itemEl, item.title, {
  //       placement: "top",
  //     });

  //     Wrapper.appendChild(itemEl);
  //   });

  //   return Wrapper;
  // }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {DelimiterData} - saved data
   * @public
   */
  save(toolsContent) {
    const data = this.ui.data;
    console.log("collapse save: ", data, toolsContent);
    return data;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.6001 0.398438C1.4951 0.398438 0.600098 1.29344 0.600098 2.39844V18.3984C0.600098 19.5034 1.4951 20.3984 2.6001 20.3984H8.6001C9.15238 20.3984 9.6001 19.9507 9.6001 19.3984C9.6001 18.8462 9.15238 18.3984 8.6001 18.3984H2.6001V14.3984H16.6001V12.3984H2.6001V8.39844H14.6001V12.3984L16.6001 14.3984V2.39844C16.6001 1.29344 15.7051 0.398438 14.6001 0.398438H2.6001ZM2.6001 2.39844H14.6001V6.39844H2.6001V2.39844Z" fill="#007BFF"/>
						</svg>`,
      title: "Аккордион",
    };
  }
}
