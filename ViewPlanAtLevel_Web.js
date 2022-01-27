window.ViewPlanAtLevel = window.ViewPlanAtLevel || {};

/*** web/UI code - runs natively in the plugin process ***/

// initialize the UI
ViewPlanAtLevel.initializeUI = function()
{
    // create a container for all UI elements that should show
    let contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer';
    window.document.body.appendChild(contentContainer);

    // create the overall header
    let headerContainer = new FormIt.PluginUI.HeaderModule('View Plan at Level', 'Set the camera to view the orthographic floor plan at the selected level.', 'headerContainer');
    contentContainer.appendChild(headerContainer.element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

// update the UI
ViewPlanAtLevel.updateUI = function()
{
    // get general selection info from Properties Plus
    window.FormItInterface.CallMethod("PropertiesPlus.getSelectionInfo", { }, function(result)
    {
        let currentSelectionInfo = JSON.parse(result);

        // update the cards that are always shown
        ViewPlanAtLevel.editingHistoryInfoCard.update(currentSelectionInfo);
        ViewPlanAtLevel.selectionCountInfoCard.update(currentSelectionInfo);


    });
}