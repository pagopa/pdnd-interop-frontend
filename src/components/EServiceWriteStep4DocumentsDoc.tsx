export function EServiceWriteStep4DocumentsDoc() {}

// import isEmpty from 'lodash/isEmpty'
// import React, { useState } from 'react'
// import { Button, Form } from 'react-bootstrap'
// import {
//   EServiceDescriptorRead,
//   EServiceDocumentRead,
//   EServiceDocumentWrite,
//   EServiceReadType,
// } from '../../types'
// import { getActiveDocs } from '../lib/eservice-utils'
// import { StyledDeleteableDocument } from './StyledDeleteableDocument'
// import { StyledInputFile } from './StyledInputFile'
// import { StyledInputTextArea } from './StyledInputTextArea'
// import { StyledIntro } from './StyledIntro'
// import { WhiteBackground } from './WhiteBackground'

// type EServiceWriteStep4DocumentsDocProps = {
//   fetchedData: EServiceReadType
//   uploadDescriptorDocument: any
//   deleteDescriptorDocument: any
//   activeDescriptorId: string
//   runAction: any
// }

// export function EServiceWriteStep4DocumentsDoc({
//   fetchedData,
//   uploadDescriptorDocument,
//   deleteDescriptorDocument,
//   activeDescriptorId,
//   runAction,
// }: EServiceWriteStep4DocumentsDocProps) {
//   const initialDocs = getActiveDocs(fetchedData, activeDescriptorId)

//   const [readDocs, setReadDocs] = useState<EServiceDocumentRead[]>(initialDocs)
//   const [writeDocs, setWriteDocs] = useState<Partial<EServiceDocumentWrite>>()

//   const deletePreviousInterfaceDoc = async () => {
//     const { outcome } = deleteDescriptorDocument(readDoc!.id)

//     if (outcome === 'success') {
//       setReadDoc(undefined)
//       setWriteDoc(undefined)
//     }
//   }

//   const uploadNewInterfaceDoc = async (e: any) => {
//     e.preventDefault()

//     if (!isEmpty(readDoc)) {
//       await deletePreviousInterfaceDoc()
//     }

//     const { outcome, response } = await uploadDescriptorDocument(writeDoc)

//     if (outcome === 'success') {
//       const activeDescriptor = response.data.descriptors.find(
//         (d: EServiceDescriptorRead) => d.id === activeDescriptorId
//       )
//       const file = activeDescriptor.interface
//       setReadDoc(file)
//     }
//   }

//   const wrapUpdateDoc = (type: 'doc' | 'description') => (e: any) => {
//     const value = type === 'doc' ? e.target.files[0] : e.target.value
//     setWriteDoc({ ...writeDoc, [type]: value })
//   }

//   return (
//     <WhiteBackground>
//       <StyledIntro>
//         {{
//           title: 'Interfaccia*',
//           description: "Carica il file OpenAPI/WSDL che descrive l'API",
//         }}
//       </StyledIntro>

//       {readDoc ? (
//         <StyledDeleteableDocument
//           eserviceId={fetchedData.id}
//           descriptorId={fetchedData.activeDescriptor!.id}
//           readable={readDoc}
//           deleteDocument={deletePreviousInterfaceDoc}
//           runAction={runAction}
//         />
//       ) : (
//         <Form onSubmit={uploadNewInterfaceDoc}>
//           <StyledInputFile
//             id="interface-doc"
//             label="Seleziona documento"
//             value={writeDoc?.doc}
//             onChange={wrapUpdateDoc('doc')}
//           />

//           <StyledInputTextArea
//             label="Descrizione"
//             value={writeDoc?.description || ''}
//             onChange={wrapUpdateDoc('description')}
//           />

//           <div className="d-flex justify-content-end">
//             <Button type="submit" variant="primary">
//               carica
//             </Button>
//           </div>
//         </Form>
//       )}
//     </WhiteBackground>
//   )
// }
