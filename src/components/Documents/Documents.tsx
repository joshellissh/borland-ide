import {JSX} from "react";
import {useAppSelector} from "../../hooks.ts";
import {selectDocuments} from "./documentsSlice.ts";
import {Document} from "./Document/Document.tsx";

export default function Documents() {
    // const activeDocument = useAppSelector(selectActiveDocument);
    const documents = useAppSelector(selectDocuments);

    function drawDocuments(): JSX.Element[] {
        const docs = [];

        for (const [, v] of documents) {
            docs.push(<Document
                docInfo={v}
                key={v.name}
            />);
        }

        return docs;
    }

    return drawDocuments();
}