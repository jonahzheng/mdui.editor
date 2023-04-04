import 'mdui.jq/es/methods/after';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/is';
import { returnFalse } from 'mdui.jq/es/utils';
import 'mdui/es/components/dialog/prompt';
import 'mdui/es/components/textfield';
import mdui from 'mdui/es/mdui';
import MenuAbstract from '../abstracts/menuAbstract';

/**
 * 添加链接
 */
class Audio extends MenuAbstract {
  static icon = 'headset';
  static title = '插入音频';
  // static disable = ['image'];

  public onclick(): void {
    const $curElem = this.selection.getContainerElem();
    let defaultUrl = '';

    if ($curElem.is('a')) {
      // 当前选区为 a 元素，则选中整个 a 元素
      this.selection.createRangeByElem($curElem, false, true);
      defaultUrl = $curElem.attr('href') || '';
    }

    const dialog = mdui.prompt(
      '请输入音频地址',
      (url, dialog): void => {
        if (!url) {
          // 链接为空，移除链接
          this.command.do('unlink');
          dialog.close();
          return;
        }

        const input = dialog.$element.find(
          '.mdui-textfield-input',
        )[0] as HTMLInputElement;

        if (input.validity && input.validity.valid) {
          const $rootElem = this.selection.getRootElem(); 
          const rootHTML = $rootElem.html().toLowerCase().trim(); 
          const imgHTML = `<audio id="audio" controls="" preload="none"><source id="mp3" src="${url}"></audio>`;

          if (
            $rootElem[0].nodeName === 'P' &&
            (rootHTML === '<br>' || rootHTML === '<br/>')
          ) {
            // 当前为空的 p 元素，替换该元素
            this.command.do('replaceRoot', imgHTML);
          } else {
            // 当前不是空的 p 元素，在当前元素后面插入图片
            this.command.do('insertAfterRoot', imgHTML);
          }
  
          // 在图片下面重新插入一行，并聚焦
          this.command.do('insertAfterRoot', '<p><br></p>');
          dialog.close();
          return;
        }
      },
      returnFalse,
      {
        confirmText: '确认',
        cancelText: '取消',
        defaultValue: defaultUrl,
        confirmOnEnter: true,
        closeOnConfirm: false,
      },
    );

    dialog.$element
      .find('.mdui-textfield-input')
      .attr('type', 'text')
      .attr('pattern', '^(https?|ftp|file)://[\\S]+\\.[\\S]+$')
      .after('<div class="mdui-textfield-error">链接格式错误</div>');

    mdui.updateTextFields(dialog.$element.find('.mdui-textfield'));
    dialog.handleUpdate();
  }

  public isActive(): boolean {
    return this.selection.getContainerElem().is('a');
  }
}

export default Audio;