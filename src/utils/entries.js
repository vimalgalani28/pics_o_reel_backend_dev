const getEntries = (entry) => {
    const entryObject = entry.toObject()
    delete entryObject.voteCount
    delete entryObject.driveId
    delete entryObject.imageViewLink
    delete entryObject.ownerName
    delete entryObject.ownerPhone
    return entryObject
}

export { getEntries }