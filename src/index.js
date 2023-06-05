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

		console.log({ data, config, api }, 9)

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
  renderSettings() {
    const Wrapper = make("div");

    const settings = [
      {
        title: "Режим расширения",
        action: MODE.ROW,
        icon: RowModeIcon,
      },
      {
        title: "Режим предварительного просмотра",
        action: MODE.COLUMN,
        icon: ColumnModeIcon,
      },
    ];

    settings.forEach((item) => {
      const itemEl = make("div", this.CSS.settingsButton, {
        innerHTML: item.icon,
      });

      if (item.action === MODE.ROW) {
        this._data.mode === MODE.ROW
          ? itemEl.classList.add(this.CSS.settingsButtonActive)
          : itemEl.classList.remove(this.CSS.settingsButtonActive);
      } else {
        this._data.mode === MODE.COLUMN
          ? itemEl.classList.add(this.CSS.settingsButtonActive)
          : itemEl.classList.remove(this.CSS.settingsButtonActive);
      }

      itemEl.addEventListener("click", () => {
        this._data.mode = item.action;
        this.reRender(this._data);
      });

      this.api.tooltip.onHover(itemEl, item.title, {
        placement: "top",
      });

      Wrapper.appendChild(itemEl);
    });

    return Wrapper;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {DelimiterData} - saved data
   * @public
   */
  save(toolsContent) {
    const data = this.ui.data;

		const titleBlock = toolsContent.querySelector('.cdx-collapse-title');
		const title = titleBlock.value;

    return {
			...data,
			title
		};
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
      icon: `
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.6001 2.39844C4.4951 2.39844 3.6001 3.29344 3.6001 4.39844V20.3984C3.6001 21.5034 4.4951 22.3984 5.6001 22.3984H11.6001C12.1524 22.3984 12.6001 21.9507 12.6001 21.3984C12.6001 20.8462 12.1524 20.3984 11.6001 20.3984H5.6001V16.3984H19.6001V14.3984H5.6001V10.3984H17.6001V14.3984L19.6001 16.3984V4.39844C19.6001 3.29344 18.7051 2.39844 17.6001 2.39844H5.6001ZM5.6001 4.39844H17.6001V8.39844H5.6001V4.39844Z" stroke-width="0" fill="#007BFF"/>
					<path d="M17.5391 16.2695L15.2695 18.5391L13 16.2695" stroke="#007BFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
						`,
      title: "Аккордион",
    };
  }
}
