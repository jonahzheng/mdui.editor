import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/text';
import MenuAbstract from '../abstracts/menuAbstract';
import $ from 'mdui.jq';

/**
 * 标题
 */
class AlignLeft extends MenuAbstract {
  static icon = 'format_align_left';
  static title = '居左';
  //static disable = ['bold', 'italic', 'image'];
  private active = false;

  private css_key = 'text-align';
  private css_value = 'left';

  public onclick(): void {
    const $rootElem = this.selection.getRootElem();

    //如果已经激活，就不管它
    if (this.active) {
      if ($rootElem.length == 1) {
        //如果已经激活，就把这个css去掉
        $rootElem.css(this.css_key, '');
        //然后通知一下
        this.command.do('replaceRoot', $rootElem[0].outerHTML);
      }
      // // 若当前是 h2，则转换为 p
      return;
    }
    //如果没有激活，则判断一下
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
    this.active =
      this.selection.getRootElem().css(this.css_key) == this.css_value;
    return this.active;
  }
}

export default AlignLeft;
