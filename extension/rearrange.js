(() => {
    const remoteVideosContainer
        = document.getElementById('filmstripRemoteVideosContainer');
    const localVideoContainer
        = document.getElementById('localVideoTileViewContainer');

    [...remoteVideosContainer.children]
        .slice(0, remoteVideosContainer.children.length - 1)
        .sort((a, b) => {
            const [ nameA, nameB ] = [ a, b ].map(
                element => element.querySelector('.displayName')
                    .textContent
                    .trim()
                    .toLowerCase()
            );

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
        .forEach(node => remoteVideosContainer.insertBefore(node, localVideoContainer));
})();
