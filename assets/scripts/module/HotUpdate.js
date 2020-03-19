var UpdatePanel = require('../UI/UpdatePanel');

// Custom manifest removed the following assets:
// 1. res/raw-assets/2a/2a40e5e7-4c4a-4350-9e5d-76757755cdd2.png
// 2. res/raw-assets/2d/2d86a854-63c4-4b90-8b88-a4328b8526c2.png
// So when custom manifest used, you should be able to find them in downloaded remote assets
var customManifestStr = JSON.stringify({"packageUrl":"http://139.162.56.106/tutorial-hot-update/remote-assets/","remoteManifestUrl":"http://139.162.56.106/tutorial-hot-update/remote-assets/project.manifest","remoteVersionUrl":"http://139.162.56.106/tutorial-hot-update/remote-assets/version.manifest","version":"1.0.0","assets":{"src/cocos2d-jsb.ce1b2.js":{"size":2973428,"md5":"9d7b18a8ccc5cb75fcbf9768e66df981"},"src/project.dev.07318.js":{"size":89022,"md5":"073186b2bb0d8995930c10405d554c60"},"src/settings.dada6.js":{"size":7492,"md5":"dada69b46c4c0e5f57a0939f9e8fb5c7"},"res/import/02/024cf3666.3f588.json":{"size":14794,"md5":"3f5887e09a81a0e23d6ae7a5a681c962"},"res/import/05/055fd0727.bb3c6.json":{"size":4818,"md5":"bb3c632a7183ff0e4a79abaee6e19dfb"},"res/import/07/07df488d9.9a5da.json":{"size":341,"md5":"9a5da7b108bde1716f492c3ae27a79c9"},"res/import/09/0936e069c.e71ec.json":{"size":10928,"md5":"e71ec60706a552836136086c770c9384"},"res/import/0b/0b24a7a80.ddd78.json":{"size":78356,"md5":"ddd78956033ea1348c6ab7e80935eced"},"res/import/0e/0e93aeaa-0b53-4e40-b8e0-6268b4e07bd7.c8c88.json":{"size":3545,"md5":"c8c8840ec328fb78670c803184897a90"},"res/import/14/144c3297-af63-49e8-b8ef-1cfa29b3be28.c870e.json":{"size":1786,"md5":"c870edc523764c395590566c5fceaea7"},"res/import/28/2874f8dd-416c-4440-81b7-555975426e93.42725.json":{"size":3197,"md5":"4272505fc3b89d3a0a407498b936b0d7"},"res/import/2a/2a296057-247c-4a1c-bbeb-0548b6c98650.8bd58.json":{"size":270,"md5":"8bd5883e722f957ddec43f050ae28b2e"},"res/import/3a/3a7bb79f-32fd-422e-ada2-96f518fed422.8b874.json":{"size":168,"md5":"8b8745118af36550c04d0b991caebe01"},"res/import/49/49539cb0-3893-459a-b310-7cc1b7f6d335.8a363.json":{"size":72,"md5":"8a36388cda7c3773b5bf7a53d8824535"},"res/import/6d/6d91e591-4ce0-465c-809f-610ec95019c6.2f5cc.json":{"size":15303,"md5":"2f5cc6227bf85bcc84ec7d19765d887b"},"res/import/6f/6f801092-0c37-4f30-89ef-c8d960825b36.58d0e.json":{"size":161,"md5":"58d0ec4426c5cf4e40b43488a88d97d4"},"res/import/79/79eafaef-b7ef-45d9-9c3f-591dc836fc7a.1cc93.json":{"size":15423,"md5":"1cc9383d9c3e31e0a03116aefb72ac57"},"res/import/7a/7afd064b-113f-480e-b793-8817d19f63c3.e5a11.json":{"size":162,"md5":"e5a1199c53ab040a2da8a21dc8df6a08"},"res/import/9e/9e2ae507-fae5-4511-940b-f2e46f81b790.98f6b.json":{"size":74,"md5":"98f6b1d93a4ee3a1f2074be9ce00fbb2"},"res/import/c0/c0040c95-c57f-49cd-9cbc-12316b73d0d4.21150.json":{"size":995,"md5":"2115086df85cd0d2fd2f30091fb16423"},"res/import/cf/cf7e0bb8-a81c-44a9-ad79-d28d43991032.247fd.json":{"size":167,"md5":"247fd79cda4bfa4c822745ce5adab12d"},"res/import/e9/e9cd33c3-477d-41dd-b1e9-a25c66412443.3f79d.json":{"size":76,"md5":"3f79d93ce8d42b186ecd43d868c8d023"},"res/import/ec/eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432.fa7d0.json":{"size":190,"md5":"fa7d0b492f50e393abec4919dbc049c1"},"res/raw-assets/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.cea68.png":{"size":82,"md5":"cea68f0d7cba38440224f6f74531e2d8"},"res/raw-assets/49/49539cb0-3893-459a-b310-7cc1b7f6d335.f45ec.mp3":{"size":971644,"md5":"f45ec6666f06b729d8c0461bc89d4b94"},"res/raw-assets/6e/6e056173-d285-473c-b206-40a7fff5386e.6d3cf.png":{"size":1633,"md5":"6d3cf6c6ee7dbfbab63c2bbd2d135ad5"},"res/raw-assets/71/71561142-4c83-4933-afca-cb7a17f67053.c06a9.png":{"size":1050,"md5":"c06a93f5f1a8a1c6edc4fd8b52e96cbf"},"res/raw-assets/99/99170b0b-d210-46f1-b213-7d9e3f23098a.d1118.png":{"size":1177,"md5":"d1118d133683bb4227d5e60c79c846b7"},"res/raw-assets/9e/9e2ae507-fae5-4511-940b-f2e46f81b790.90d17.mp3":{"size":3179,"md5":"90d17b1a25200c90e292d9a3748c9fec"},"res/raw-assets/a5/a5a9e16f-0ef7-46f3-aa69-564b6532d3f6.a6e5e.png":{"size":397884,"md5":"a6e5e6efb87e299927e1beae036f2503"},"res/raw-assets/b4/b43ff3c2-02bb-4874-81f7-f2dea6970f18.83fcc.png":{"size":1114,"md5":"83fcc9912e01ae5411c357651fb8b1cf"},"res/raw-assets/bc/bc490754-c551-492e-a583-1c5c8de2f448.79fa9.png":{"size":546622,"md5":"79fa9a07887c7f46f4a2d6d61e4d19d0"},"res/raw-assets/c5/c5f60c62-1ec5-4865-9a5b-25b3ec70f247.03bcf.png":{"size":83306,"md5":"03bcfba7bef8c4048cab7b0c3b144ad8"},"res/raw-assets/cf/cfef78f1-c8df-49b7-8ed0-4c953ace2621.a4b59.png":{"size":1140,"md5":"a4b5953dffeb145b4b70072d91c4052b"},"res/raw-assets/e8/e851e89b-faa2-4484-bea6-5c01dd9f06e2.90cf4.png":{"size":1082,"md5":"90cf45d059d0408bec327f66eae5764c"},"res/raw-assets/e9/e9cd33c3-477d-41dd-b1e9-a25c66412443.065e0.manifest":{"size":7349,"md5":"065e0e849e673ee23e16bc7e521b0fa5"}},"searchPaths":[]});

cc.Class({
    extends: cc.Component,

    properties: {
        panel: UpdatePanel,
        manifestUrl: {
            type: cc.Asset,
            default: null
        },
        updateUI: cc.Node,
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.panel.info.string = 'New version found, please try to update.';
                this.panel.checkBtn.active = false;
                this.panel.fileProgress.progress = 0;
                this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }
        
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.panel.byteProgress.progress = event.getPercent();
                this.panel.fileProgress.progress = event.getPercentByFile();

                this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    this.panel.info.string = 'Updated file: ' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.panel.info.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.panel.info.string = 'Update failed. ' + event.getMessage();
                this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.panel.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    loadCustomManifest: function () {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            this.panel.info.string = 'Using custom manifest';
        }
    },
    
    retry: function () {
        if (!this._updating && this._canRetry) {
            this.panel.retryBtn.active = false;
            this._canRetry = false;
            
            this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },
    
    checkUpdate: function () {
        if (this._updating) {
            this.panel.info.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._am.update();
            this.panel.updateBtn.active = false;
            this._updating = true;
        }
    },
    
    show: function () {
        if (this.updateUI.active === false) {
            this.updateUI.active = true;
        }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-test-remote-asset');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        var panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        this.panel.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        
        this.panel.fileProgress.progress = 0;
        this.panel.byteProgress.progress = 0;
    },

    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }
});
