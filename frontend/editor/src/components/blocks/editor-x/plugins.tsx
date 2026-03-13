import { useState } from "react";
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { ContentEditable } from "../../editor//editor-ui/content-editable";
import { ActionsPlugin } from "../../editor//plugins/actions/actions-plugin";
import { ClearEditorActionPlugin } from "../../editor//plugins/actions/clear-editor-plugin";
import { CounterCharacterPlugin } from "../../editor//plugins/actions/counter-character-plugin";
import { EditModeTogglePlugin } from "../../editor//plugins/actions/edit-mode-toggle-plugin";
import { AutoLinkPlugin } from "../../editor//plugins/auto-link-plugin";
import { CodeActionMenuPlugin } from "../../editor//plugins/code-action-menu-plugin";
import { CodeHighlightPlugin } from "../../editor//plugins/code-highlight-plugin";
import { ComponentPickerMenuPlugin } from "../../editor//plugins/component-picker-menu-plugin";
import ContextMenuPlugin from "../../editor//plugins/context-menu-plugin";
import { DragDropPastePlugin } from "../../editor//plugins/drag-drop-paste-plugin";
import { DraggableBlockPlugin } from "../../editor//plugins/draggable-block-plugin";
import { AutoEmbedPlugin } from "../../editor//plugins/embeds/auto-embed-plugin";
import { TwitterPlugin } from "../../editor//plugins/embeds/twitter-plugin";
import { YouTubePlugin } from "../../editor//plugins/embeds/youtube-plugin";
import { EmojiPickerPlugin } from "../../editor//plugins/emoji-picker-plugin";
import { EmojisPlugin } from "../../editor//plugins/emojis-plugin";
import { FloatingLinkEditorPlugin } from "../../editor//plugins/floating-link-editor-plugin";
import { FloatingTextFormatToolbarPlugin } from "../../editor//plugins/floating-text-format-plugin";
import { ImagesPlugin } from "../../editor//plugins/images-plugin";
import { KeywordsPlugin } from "../../editor//plugins/keywords-plugin";
import { LayoutPlugin } from "../../editor//plugins/layout-plugin";
import { LinkPlugin } from "../../editor//plugins/link-plugin";
import { ListMaxIndentLevelPlugin } from "../../editor//plugins/list-max-indent-level-plugin";
import { MentionsPlugin } from "../../editor//plugins/mentions-plugin";
import { AlignmentPickerPlugin } from "../../editor//plugins/picker/alignment-picker-plugin";
import { BulletedListPickerPlugin } from "../../editor//plugins/picker/bulleted-list-picker-plugin";
import { CheckListPickerPlugin } from "../../editor//plugins/picker/check-list-picker-plugin";
import { CodePickerPlugin } from "../../editor//plugins/picker/code-picker-plugin";
import { ColumnsLayoutPickerPlugin } from "../../editor//plugins/picker/columns-layout-picker-plugin";
import { DividerPickerPlugin } from "../../editor//plugins/picker/divider-picker-plugin";
import { EmbedsPickerPlugin } from "../../editor//plugins/picker/embeds-picker-plugin";
import { HeadingPickerPlugin } from "../../editor//plugins/picker/heading-picker-plugin";
import { ImagePickerPlugin } from "../../editor//plugins/picker/image-picker-plugin";
import { NumberedListPickerPlugin } from "../../editor//plugins/picker/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "../../editor//plugins/picker/paragraph-picker-plugin";
import { QuotePickerPlugin } from "../../editor//plugins/picker/quote-picker-plugin";
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "../../editor//plugins/picker/table-picker-plugin";
import { TabFocusPlugin } from "../../editor//plugins/tab-focus-plugin";
import { BlockFormatDropDown } from "../../editor//plugins/toolbar/block-format-toolbar-plugin";
import { FormatBulletedList } from "../../editor//plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "../../editor//plugins/toolbar/block-format/format-check-list";
import { FormatHeading } from "../../editor//plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "../../editor//plugins/toolbar/block-format/format-numbered-list";
import { FormatParagraph } from "../../editor//plugins/toolbar/block-format/format-paragraph";
import { FormatQuote } from "../../editor//plugins/toolbar/block-format/format-quote";
import { BlockInsertPlugin } from "../../editor//plugins/toolbar/block-insert-plugin";
import { InsertImage } from "../../editor//plugins/toolbar/block-insert/insert-image";
import { InsertTable } from "../../editor//plugins/toolbar/block-insert/insert-table";
import { CodeLanguageToolbarPlugin } from "../../editor//plugins/toolbar/code-language-toolbar-plugin";
import { FontBackgroundToolbarPlugin } from "../../editor//plugins/toolbar/font-background-toolbar-plugin";
import { FontColorToolbarPlugin } from "../../editor//plugins/toolbar/font-color-toolbar-plugin";
import { FontFormatToolbarPlugin } from "../../editor//plugins/toolbar/font-format-toolbar-plugin";
import { LinkToolbarPlugin } from "../../editor//plugins/toolbar/link-toolbar-plugin";
import { ToolbarPlugin } from "../../editor//plugins/toolbar/toolbar-plugin";
import { EMOJI } from "../../editor//transformers/markdown-emoji-transformer";
import { HR } from "../../editor//transformers/markdown-hr-transformer";
import { IMAGE } from "../../editor//transformers/markdown-image-transformer";
import { TABLE } from "../../editor//transformers/markdown-table-transformer";
import { TWEET } from "../../editor//transformers/markdown-tweet-transformer";
import { Separator } from "../../ui/separator";
import { cn } from "../../../lib/utils";
import TableResizePlugin from "../../editor/plugins/TableResizePlugin";

const placeholder = "Press / for commands...";

export function Plugins({
  convertFilesToImageUrl,
  mentionsData,
  useMentionLookupService,
  isCompact,
  editorClassNames,
}: {
  convertFilesToImageUrl?: (files: any) => Promise<any>;
  mentionsData?: { mentionName: string; label: string }[];
  useMentionLookupService?: (
    mentionString: string | null,
    usersList?: { mentionName: string; label: string }[],
  ) => {
    mentionName: string;
    label: string;
  }[];
  isCompact?: boolean;
  editorClassNames?: string;
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b p-1">
            <BlockFormatDropDown isCompact={isCompact}>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === "code" ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <Separator orientation="vertical" className="!h-7" />
                <FontFormatToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <BlockInsertPlugin isCompact={isCompact}>
                  {convertFilesToImageUrl && (
                    <InsertImage
                      convertFilesToImageUrl={convertFilesToImageUrl}
                    />
                  )}
                  <InsertTable />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative h-full flex-1 overflow-auto">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className={cn(
                    "ContentEditable__root relative block h-auto min-h-36 overflow-auto px-8 py-4 focus:outline-none",
                    editorClassNames,
                  )}
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <TableResizePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />
        <MentionsPlugin
          mentionsData={mentionsData}
          useMentionLookupService={useMentionLookupService}
        />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />
        <LayoutPlugin />
        <AutoEmbedPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
        <TabFocusPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            TablePickerPlugin(),
            CheckListPickerPlugin(),
            NumberedListPickerPlugin(),
            BulletedListPickerPlugin(),
            QuotePickerPlugin(),
            CodePickerPlugin(),
            DividerPickerPlugin(),
            EmbedsPickerPlugin({ embed: "tweet" }),
            EmbedsPickerPlugin({ embed: "youtube-video" }),
            ...(convertFilesToImageUrl
              ? [ImagePickerPlugin({ convertFilesToImageUrl })]
              : []),
            ColumnsLayoutPickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
          dynamicOptionsFn={DynamicTablePickerPlugin}
        />

        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />
        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <FloatingTextFormatToolbarPlugin
          anchorElem={floatingAnchorElem}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <ListMaxIndentLevelPlugin />
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="px-2">
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            <EditModeTogglePlugin />
            <ClearEditorActionPlugin />
            <ClearEditorPlugin />
          </div>
        </div>
      </ActionsPlugin>
    </div>
  );
}
