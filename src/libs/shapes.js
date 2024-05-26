export async function buildFrame(frame){


    await figma.loadFontAsync({ family: "Inter", style: "Regular" })
    const ellipse = figma.createEllipse()
    ellipse.x = figma.viewport.center.x
    ellipse.y = figma.viewport.center.y
    ellipse.resize(24, 24)
    ellipse.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]


    const text = figma.createText()
    text.x = figma.viewport.center.x
    text.y = figma.viewport.center.y
    
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    text.characters = `Recipe saved on ${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()} at ${date.getHours()} : ${date.getMinutes()}`;
    
    text.fontSize = 24
    text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]

    frame.name = 'Backup - Select and click on load to retriece Recipe';
    frame.x = figma.viewport.center.x
    frame.y = figma.viewport.center.y

  
    const frameContent = figma.createFrame()

    // Set size to 1280 x 720
    frameContent.resize(200, 200);
    frameContent.appendChild(ellipse);
    frameContent.appendChild(text);

    frame.appendChild(frameContent);

    frame.layoutMode = 'VERTICAL'

    frameContent.layoutMode = 'HORIZONTAL'
    frame.layoutSizingVertical = 'HUG'
    frameContent.layoutSizingVertical = 'HUG'
    frame.layoutSizingHorizontal = 'HUG'
    frameContent.layoutSizingHorizontal = 'HUG'
    frameContent.counterAxisAlignItems = 'CENTER'
    frameContent.itemSpacing = 8;

    frameContent.locked=true;

    return frame;

}