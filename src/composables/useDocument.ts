import type {MimeType} from '#/document'


function createFileLink(pathFile: string, name: string) {
  const anchor = document.createElement('a')
  anchor.href = pathFile
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export default function useDocument() {

  const mimeTypesLabels = [
    {
      value: 'application/pdf',
      label: '.pdf'
    },
    {
      value: 'image/jpeg',
      label: '.jpg/.jpeg'
    },
    {
      value: 'image/png',
      label: '.png'
    },
    {
      value: 'application/msword',
      label: '.doc'
    },
    {
      value: 'application/vnd.oasis.opendocument.text',
      label: '.odt'
    },
    {
      value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      label: '.docx'
    },
    {
      value: 'application/vnd.ms-excel',
      label: '.xls'
    },
    {
      value: 'application/vnd.oasis.opendocument.spreadsheet',
      label: '.ods'
    },
    {
      value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      label: '.xlsx'
    },
    {
      value: 'application/x-7z-compressed',
      label: '.7z'
    },
    {
      value: 'application/x-bzip2',
      label: '.bz2'
    },
    {
      value: 'application/x-rar-compressed',
      label: '.rar'
    },
    {
      value: 'application/x-tar',
      label: '.tar'
    },
    {
      value: 'application/zip',
      label: '.zip'
    }
  ]

  const acceptedFormats = (mimeTypes: MimeType[] | undefined): string => {
    return mimeTypes?.map(mimeType => mimeTypesLabels
      .find(obj => obj.value === mimeType)?.label ?? '').join(', ')
  }


  return {
    createFileLink,
    mimeTypesLabels,
    acceptedFormats,
  }
}
