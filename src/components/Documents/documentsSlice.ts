import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {DocumentInfo} from "../../types.ts";
import {RootState} from "../../store.ts";

export interface DocumentsState {
    activeDocument: number;
    documentNumber: number;
    documents: Map<number, DocumentInfo>;
}

const initialState: DocumentsState = {
    activeDocument: 0,
    documentNumber: 0,
    documents: new Map([
        [0, {
            id: 0,
            name: "NONAME00.CPP",
            docPos: {x: 0, y: 0},
            docSize: {width: 80, height: 17}
        }]
    ])
};

export const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        newDocument: state => {
            state.documentNumber += 1;
            state.documents.set(
                state.documentNumber,
                {
                    id: state.documentNumber,
                    name: "NONAME" + state.documentNumber.toString().padStart(2, "0") + ".CPP",
                    docPos: {x: 1, y: 1},
                    docSize: {width: 80, height: 18}
                }
            );
            state.activeDocument = state.documentNumber;
        },
        closeDocument: (state, payload: PayloadAction<number>) => {
            state.documents.delete(payload.payload);
        },
    }
});

export const selectActiveDocument = (state: RootState) => state.documents.activeDocument;
export const selectDocuments = (state: RootState) => state.documents.documents;

export const { newDocument, closeDocument } = documentsSlice.actions;
export default documentsSlice.reducer;