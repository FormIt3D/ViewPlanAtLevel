var ViewPlanAtLevel = ViewPlanAtLevel || {};

/*** the FormIt application-side JS engine only supports ES5 syntax, so use var here ***/

// for v22, hard-code the camera down data
// with the camera looking down at the origin
// in v23, this can be changed to a dynamic call to SetCameraForward
ViewPlanAtLevel.cameraDownData = '{"FOV":0.5158407688140869,"distanceToTarget":10.092096328735352,"objectName":"CameraData","posX":-9.947598300641404e-16,"posY":1.7763568394002505e-15,"posZ":10.092096517794872,"projectionType":1,"rotW":1,"rotX":0,"rotY":0,"rotZ":0}';

ViewPlanAtLevel.activeNotificationHandle = undefined;

ViewPlanAtLevel.getAllLevelNames = function()
{
    var aAllLevelsData = FormIt.Levels.GetLevelsData(0 /* levels are in main history only */, true /* sort by elevation */);
    var allLevelNames = [];

    for(var i = 0; i < aAllLevelsData.length; i++)
    {
        var name = aAllLevelsData[i].Name;
        allLevelNames.push(name);
    }

    return allLevelNames;
}

ViewPlanAtLevel.setViewAtLevel = function(args)
{
    FormIt.UndoManagement.BeginState();

    var sLevelName = args.sLevelName;
    var bZoomToSelected = args.bZoomToSelected;

    // get the camera height from the name
    var nLevelHeight = Number(ViewPlanAtLevel.getLevelElevationByName(sLevelName));
    // set the camera cutting plane 4' above level height
    var nCameraHeight = nLevelHeight + 4;

    // record the camera data before anything changes
    var currentCameraData = FormIt.Cameras.GetCameraData();

    // set the view to perspective
    FormIt.Cameras.SetProjectionType(0);

    if (bZoomToSelected && FormIt.Selection.GetSelections().length > 0)
    {
        // set the camera data to the pre-baked data so it's facing down
        FormIt.Cameras.SetCameraData(ViewPlanAtLevel.cameraDownData);
        FormIt.View.FitToSelection(false /* no transition */);
    }
    else
    {
        // take the current view and force the camera to look down
        currentCameraData.rotW = 1;
        currentCameraData.rotX = 0;
        currentCameraData.rotY = 0;
        currentCameraData.rotZ = 0;
        FormIt.Cameras.SetCameraData(currentCameraData);
    }

    // then set the height
    var adjustedCameraData = FormIt.Cameras.GetCameraData();
    adjustedCameraData.posZ = nCameraHeight;
    FormIt.Cameras.SetCameraData(adjustedCameraData);

    // then set the view to orthographic
    FormIt.Cameras.SetProjectionType(1);

    // clear the selection
    FormIt.Selection.ClearSelections();

    ViewPlanAtLevel.clearNotificationHandles();
    ViewPlanAtLevel.activeNotificationHandle = FormIt.UI.ShowNotification('Now showing: ' + sLevelName, FormIt.NotificationType.Success, 0);

    FormIt.UndoManagement.EndState();
}

ViewPlanAtLevel.getLevelElevationByName = function(sLevelName)
{   
    var aAllLevelsData = FormIt.Levels.GetLevelsData(0 /* levels are in main history only */, true /* sort by elevation */);
    var nMatchingLevelHeight = undefined;

    for(var i = 0; i < aAllLevelsData.length; i++)
    {
        var sThisLevelName = aAllLevelsData[i].Name;

        if (sThisLevelName == sLevelName)
        {
            nMatchingLevelHeight = aAllLevelsData[i].Elevation;
        }
    }

    return nMatchingLevelHeight;
}

ViewPlanAtLevel.goTo3DView = function()
{
    // go to 3D view in perspective
    FormIt.View.HomeView3d();
    FormIt.Cameras.SetProjectionType(0);
    ViewPlanAtLevel.clearNotificationHandles();
}

ViewPlanAtLevel.showNoLevelSelectedMessage = function()
{
    ViewPlanAtLevel.activeNotificationHandle = FormIt.UI.ShowNotification('Please select a level and try again.', FormIt.NotificationType.Error, 0);
}

ViewPlanAtLevel.clearNotificationHandles = function()
{
    if (ViewPlanAtLevel.activeNotificationHandle != undefined)
    {
        FormIt.UI.CloseNotification(ViewPlanAtLevel.activeNotificationHandle);  
    }
}