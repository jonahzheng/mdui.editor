import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/text';
import MenuAbstract from '../abstracts/menuAbstract';
import $ from 'mdui.jq/es/$';

/**
 * 标题
 */
class AlignClear extends MenuAbstract {
  static icon = 'format_align_justify';
  static title = '清除align';
  //static disable = ['bold', 'italic', 'image'];
  private css_key = 'text-align';
  private css_value = '';
  public onclick(): void {
    const $rootElem = this.selection.getRootElem();
    //判断是否选中多行
    if (!$rootElem.length) {
      const range = this.selection.getRange()!;
      if (range.collapsed) {
        // 没有选中任何选区，在最后添加一行
        this.command.do(
          'appendHTML',
          '<p style="${this.css_key}:${this.css_value};"><br></p>',
        );
      } else {
        // 选中了多行，每一行都更换
        let isInRange = false;
        //遍历整个编辑器
        this.$container.children().each((_, line) => {
          const $line = $(line);
          //不在选中范围
          if (!isInRange) {
            if (
              $line.is(range.startContainer as HTMLElement) ||
              $line[0].contains(range.startContainer) ||
              this.$container.is(range.startContainer as HTMLElement)
            ) {
              isInRange = true;
            }
          }
          //在选中范围
          if (isInRange) {
            $line.css(this.css_key, this.css_value);
            if (
              $line.is(range.endContainer as HTMLElement) ||
              $line[0].contains(range.endContainer)
            ) {
              return false;
            }
          }
          return true;
        });
        this.command.do('appendHTML', ``);
      }
      return;
    }
    // 选中单行，直接变为center
    $rootElem.css(this.css_key, this.css_value);
    this.command.do('replaceRoot', $rootElem[0].outerHTML);
  }
  public isActive(): boolean {
    return false;
  }
}

export default AlignClear;
