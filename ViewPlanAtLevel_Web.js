window.ViewPlanAtLevel = window.ViewPlanAtLevel || {};

/*** web/UI code - runs natively in the plugin process ***/

ViewPlanAtLevel.levelsSelectInput = undefined;
ViewPlanAtLevel.defaultLevelInputOptionText = 'Select a level to view its plan...';

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

    // the levels select element
    ViewPlanAtLevel.levelsSelectInput = new FormIt.PluginUI.SelectInputModule('Level:', ViewPlanAtLevel.defaultLevelInputOptionText);
    // populate the list with the available levels
    ViewPlanAtLevel.populateSelectElementWithInSketchLevels(ViewPlanAtLevel.levelsSelectInput); 
    contentContainer.appendChild(ViewPlanAtLevel.levelsSelectInput.element);

    // the checkbox to use the selected building as the zoom target
    ViewPlanAtLevel.useSelectedAsZoomTargetCheckbox = new FormIt.PluginUI.CheckboxModule('Zoom to selected?', 'zoomToSelectedBuildingCheckbox', 'multiModuleContainer', 'zoomToSelectedBuildingCheckboxInput');
    ViewPlanAtLevel.useSelectedAsZoomTargetCheckbox.getInput().checked = true;
    contentContainer.appendChild(ViewPlanAtLevel.useSelectedAsZoomTargetCheckbox.element);

    // go to plan view at the selected level
    let submitGoToPlanViewAtLevel = new FormIt.PluginUI.Button('Go To Plan View', function()
    {
        let sLevelName = ViewPlanAtLevel.levelsSelectInput.getInput().value;

        // do nothing if the level isn't selected
        if (sLevelName == ViewPlanAtLevel.defaultLevelInputOptionText)
        {
            return;
        }

        let args = { "sLevelName" : sLevelName, "bZoomToSelected" : ViewPlanAtLevel.useSelectedAsZoomTargetCheckbox.getInput().checked };

        FormItInterface.CallMethod("ViewPlanAtLevel.setViewAtLevel", args, function(result)
        {

        });

    });
    contentContainer.appendChild(submitGoToPlanViewAtLevel.element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

// update the UI
ViewPlanAtLevel.updateUI = function()
{

}

ViewPlanAtLevel.populateSelectElementWithInSketchLevels = function(selectElement)
{
    window.FormItInterface.CallMethod("ViewPlanAtLevel.getAllLevelNames", { }, function(result)
    {
        selectElement.populateSelectList(JSON.parse(result));
    });
}