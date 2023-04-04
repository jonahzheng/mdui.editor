import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/text';
import MenuAbstract from '../abstracts/menuAbstract';
import { replaceHtmlSymbol } from '../utils/str';

/**
 * 标题
 */
class H1 extends MenuAbstract {
  static icon = 'title';
  static title = 'H1样式';
  static disable = ['bold', 'italic', 'image'];
  private active = false;

  public onclick(): void {
    const $rootElem = this.selection.getRootElem();

    if (this.active) {
      // 若当前是 h2，则转换为 p
      const text = $rootElem.text();
      this.command.do('replaceRoot', text ? `<p>${text}</p>` : '<p><br></p>');

      return;
    }

    if (!$rootElem.length) {
      const range = this.selection.getRange()!;

      if (range.collapsed) {
        // 没有选中任何选区，在最后添加一行
        this.command.do('appendHTML', '<h1><br></h1>');
      } else {
        // 选中了多行，不处理
      }

      return;
    }

    // 选中单行，需要移除选区内所有子元素的标签，然后转换为 h2
    this.command.do(
      'replaceRoot',
      `<h1>${replaceHtmlSymbol($rootElem.text())}</h1>`,
    );
  }

  public isActive(): boolean {
    this.active = this.selection.getRootElem().is('h1');

    return this.active;
  }
}

export default H1;
