import React, {
	useState,
	useMemo,
	useCallback,
	useRef,
	useEffect,
} from "react";
import * as ReactDOM from "react-dom";
import { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
	useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { MenuTextMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { $createMentionNode } from "./MentionNode";
import { UserIcon } from "../../icons";

const PUNCTUATION =
	"\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

const DocumentMentionsRegex = {
	NAME,
	PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ["@"].join("");

const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

const VALID_JOINS = "(?:" + "\\.[ |$]|" + " |" + "[" + PUNC + "]|" + ")";

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
	"(^|\\s|\\()(" +
		"[" +
		TRIGGERS +
		"]" +
		"((?:" +
		VALID_CHARS +
		VALID_JOINS +
		"){0," +
		LENGTH_LIMIT +
		"})" +
		")$",
);

const ALIAS_LENGTH_LIMIT = 50;

const AtSignMentionsRegexAliasRegex = new RegExp(
	"(^|\\s|\\()(" +
		"[" +
		TRIGGERS +
		"]" +
		"((?:" +
		VALID_CHARS +
		"){0," +
		ALIAS_LENGTH_LIMIT +
		"})" +
		")$",
);

function checkForAtSignMentions(
	text: string,
	minMatchLength: number,
): MenuTextMatch | null {
	let match = AtSignMentionsRegex.exec(text);

	if (match === null) {
		match = AtSignMentionsRegexAliasRegex.exec(text);
	}
	if (match !== null) {
		// The strategy ignores leading whitespace but we need to know it's
		// length to add it to the leadOffset
		const maybeLeadingWhitespace = match[1];

		const matchingString = match[3];
		if (matchingString.length >= minMatchLength) {
			return {
				leadOffset: match.index + maybeLeadingWhitespace.length,
				matchingString,
				replaceableString: match[2],
			};
		}
	}
	return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
	return checkForAtSignMentions(text, 0);
}

class MentionTypeaheadOption extends MenuOption {
	mentionName: string;
	label: string;
	picture: React.ReactElement;

	constructor(mentionName: string, picture: React.ReactElement, label: string) {
		super(label);
		this.mentionName = mentionName;
		this.picture = picture;
		this.label = label;
	}
}

function MentionsTypeaheadMenuItem({
	index,
	isSelected,
	onClick,
	onMouseEnter,
	option,
}: {
	index: number;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	option: MentionTypeaheadOption;
}) {
	let className = "item";
	if (isSelected) {
		className += " selected";
	}
	return (
		<li
			key={option.key}
			tabIndex={-1}
			className={className}
			ref={option.setRefElement}
			role="option"
			aria-selected={isSelected}
			id={"typeahead-item-" + index}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
		>
			{option.picture}
			<span className="text" data-lexical-user={option.mentionName}>
				{option.label}
			</span>
		</li>
	);
}

function defaultLookupService(
	mentionString: string | null,
	mentionsData: Array<{
		mentionName: string;
		label: string;
	}>,
) {
	const [results, setResults] = useState<
		Array<{ mentionName: string; label: string }>
	>([]);

	function defaultSearch(
		string: string,
		callback: (results: Array<{ mentionName: string; label: string }>) => void,
	): void {
		setTimeout(() => {
			const results = mentionsData.filter((mention) =>
				mention.label.toLowerCase().includes(string.toLowerCase()),
			);
			callback(results);
		}, 500);
	}

	useEffect(() => {
		if (mentionString === null) {
			setResults([]);
		} else {
			defaultSearch(mentionString, (newResults) => {
				setResults(newResults);
			});
		}
	}, [mentionString]);

	return results;
}

type Props = {
	mentionsData: Array<{
		mentionName: string;
		label: string;
	}>;
	useMentionLookupService?: (
		mentionString: string | null,
		mentionsData: Array<{
			mentionName: string;
			label: string;
		}>,
	) => Array<{
		mentionName: string;
		label: string;
	}>;
};

export default function NewMentionsPlugin({
	mentionsData,
	useMentionLookupService,
}: Props): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();
	const dropDownRef = useRef<null | HTMLDivElement>(null);
	const [searchquery, setSearchquery] = useState<string | null>(null);
	const results = useMentionLookupService
		? useMentionLookupService(searchquery, mentionsData)
		: defaultLookupService(searchquery, mentionsData);
	const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
		minLength: 0,
	});

	const options = useMemo(
		() =>
			results.map(
				(result) =>
					new MentionTypeaheadOption(
						result.mentionName,
						(
							<i className="icon">
								<UserIcon />
							</i>
						),
						result.label,
					),
			),
		[results],
	);

	const onSelectOption = useCallback(
		(
			selectedOption: MentionTypeaheadOption,
			nodeToReplace: TextNode | null,
			closeMenu: () => void,
		) => {
			editor.update(() => {
				const mentionNode = $createMentionNode(
					selectedOption.mentionName,
					selectedOption.label,
				);
				if (nodeToReplace) {
					nodeToReplace.replace(mentionNode);
				}
				mentionNode.select();
				closeMenu();
			});
		},
		[editor],
	);

	const checkForMentionMatch = useCallback(
		(text: string) => {
			const slashMatch = checkForSlashTriggerMatch(text, editor);
			if (slashMatch !== null) {
				return null;
			}
			return getPossibleQueryMatch(text);
		},
		[checkForSlashTriggerMatch, editor],
	);

	const CAN_USE_DOM: boolean =
		typeof window !== "undefined" &&
		typeof window.document !== "undefined" &&
		typeof window.document.createElement !== "undefined";

	if (CAN_USE_DOM)
		return (
			<LexicalTypeaheadMenuPlugin
				onQueryChange={setSearchquery}
				onSelectOption={onSelectOption}
				triggerFn={checkForMentionMatch}
				options={options}
				menuRenderFn={(
					anchorElementRef,
					{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
				) => {
					if (anchorElementRef.current && results.length) {
						return ReactDOM.createPortal(
							<div
								className="typeahead-popover mentions-menu"
								ref={dropDownRef}
							>
								<ul>
									{options.map((option, i: number) => (
										<MentionsTypeaheadMenuItem
											index={i}
											isSelected={selectedIndex === i}
											onClick={() => {
												setHighlightedIndex(i);
												selectOptionAndCleanUp(option);
											}}
											onMouseEnter={() => {
												setHighlightedIndex(i);
											}}
											key={option.key}
											option={option}
										/>
									))}
								</ul>
							</div>,
							anchorElementRef.current,
						);
					} else return null;
				}}
			/>
		);
	else {
		return <></>;
	}
}
