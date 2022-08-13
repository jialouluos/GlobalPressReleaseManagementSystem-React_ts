import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
interface IContent {
    title: string,
    categoryId: number,
    content: string
    region: string,
    author: string,
    roleId: number
    auditState: number
    publishState: number
    createTime: number
    star: number
    view: number
    id: number
}
interface IProps {
    content: [
        NewsFromData: IContent,
        setNewsFromData: React.Dispatch<React.SetStateAction<IContent>>
    ]

}
export default function NewEditor(props: IProps) {
    const [EdState, setEditorState] = useState<EditorState>()
    const [NewsFromData, setNewsFromData] = props.content;
    useEffect(() => {
        let contentBlock = htmlToDraft(NewsFromData.content)
        if (contentBlock) {
            setEditorState(EditorState!.createWithContent(ContentState.createFromBlockArray(contentBlock.contentBlocks)))
        }
    }, [NewsFromData.content])
    return (
        < div > <Editor
            editorState={EdState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(value) => { setEditorState(value) }}
            onBlur={() => {
                setNewsFromData({
                    ...NewsFromData,
                    content: draftToHtml(convertToRaw(EdState!.getCurrentContent()))
                })
            }}
        /></div >
    )
}
