import { Link, RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Flex, ScrollArea } from '@mantine/core';

const content = '<h1>Transcript Note</h1><p>Transcript Note</p>';

export default function TranscriptNote() {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			Superscript,
			SubScript,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
		],
		content,
	});

	return (
		<Flex align="center" className="flex-grow" direction="column" justify="start">
			<RichTextEditor className="max-h-full flex-grow bg-gray-800 rounded-lg" editor={editor}>
				<RichTextEditor.Toolbar sticky stickyOffset={60}>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						<RichTextEditor.Underline />
						<RichTextEditor.Strikethrough />
						<RichTextEditor.ClearFormatting />
						<RichTextEditor.Highlight />
						<RichTextEditor.Code />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H1 />
						<RichTextEditor.H2 />
						<RichTextEditor.H3 />
						<RichTextEditor.H4 />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						{/*<RichTextEditor.Blockquote />*/}
						{/*<RichTextEditor.Hr />*/}
						{/*<RichTextEditor.BulletList />*/}
						{/*<RichTextEditor.OrderedList />*/}
						{/*<RichTextEditor.Subscript />*/}
						{/*<RichTextEditor.Superscript />*/}
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						{/*<RichTextEditor.Link />*/}
						{/*<RichTextEditor.Unlink />*/}
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.AlignLeft />
						<RichTextEditor.AlignCenter />
						<RichTextEditor.AlignJustify />
						<RichTextEditor.AlignRight />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>
				</RichTextEditor.Toolbar>

				<ScrollArea className="flex-grow h-[500px]">
					<RichTextEditor.Content
						className="bg-gray-700 h-fit min-h-[500px]"
						style={{
							backgroundColor: 'rgb(75 85 99 / var(--tw-bg-opacity))',
						}}
					/>
				</ScrollArea>
			</RichTextEditor>
			{/*<Flex className={'w-full h-20 flex-grow'}>*/}
			{/*	<Button>*/}
			{/*		Lưu*/}
			{/*	</Button>*/}
			{/*</Flex>*/}
		</Flex>
	);
}