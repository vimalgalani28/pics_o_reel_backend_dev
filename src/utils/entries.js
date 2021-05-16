const getEntries = (entry) => {
    const entryObject = entry.toObject()
    delete entryObject.voteCount
    delete entryObject.driveId
    delete entryObject.imageViewLink
    return entryObject
}

export { getEntries }