package training.integrations.documents

uses gw.api.util.DisplayableException
uses gw.document.DocumentContentsInfo
uses gw.plugin.document.IDocumentContentSource
uses training.integrations.documents.upload.DocumentUploadService_Ext
uses training.util.logging.LoggerCategories_Ext
uses training.util.logging.Logger_Ext
uses java.io.InputStream

/**
 * author : Aravind R Pillai
 * date   : 06 May, 2022
 * desc   : Implementation for all document events
 */
class DocumentsPluginImpl_Ext implements IDocumentContentSource {

  private var _logger : Logger_Ext

  construct() {
    _logger = new Logger_Ext(DocumentsPluginImpl_Ext, LoggerCategories_Ext.DOCUMENTS)
  }

  /**
   * Function adds a document. This is the trigegr point of doc upload
   *
   * @param content
   * @param document
   * @return boolean
   */
  function addDocument(content : InputStream, document : Document) : boolean {
    _logger.info("Adding document with public id ${document.PublicID}")
    try {
      if (content != null) {
        document.Status = DocumentStatusType.TC_FINAL
        var serviceLayer = new DocumentUploadService_Ext(content, document)
        serviceLayer.execute()
        _logger.info("successfully uploaded document with public id ${document.PublicID}")
      }
      return false
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
      throw new DisplayableException(e.Message)
    }
  }

  /**
   * Returning true to enable outbound document flow
   *
   * @return boolean
   */
  property get OutboundAvailable() : boolean {
    return true
  }


  /**
   * Function to download physical document
   *
   * @param document
   * @param includeContents
   * @return
   */
  function getDocumentContentsInfo(document : Document, includeContents : boolean) : DocumentContentsInfo {
    _logger.info("Downloading Document with ID: " + document.DocUID)
    if (document.DocUID == null) {
      _logger.info("DocumentID is null")
      return null
    }
    try {
      var content : InputStream = null //get data here (allowed types : InputStream or String)
      var type = DocumentContentsInfo.ContentResponseType.DOCUMENT_CONTENTS
      return new DocumentContentsInfo(type, content, document.MimeType)
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
      throw new DisplayableException(e.Message)
    }
  }

  property get InboundAvailable() : boolean {
    return false
  }

  function isDocument(document : Document) : boolean {
    return true
  }

  function getDocumentContentsInfoForExternalUse(document : Document) : DocumentContentsInfo {
    return null
  }

  function updateDocument(document : Document, isDocument : InputStream) : boolean {
    return false
  }

  function removeDocument(document : Document) : boolean {
    return false
  }
}