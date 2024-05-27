export async function buildFrame(frame, settings, colors, icons){


    await figma.loadFontAsync({ family: "Inter", style: "Regular" })


    // The base frames
    frame.name = 'MY RECIPE - Select this card and click on Load in the plugin to restore the recipe';
    frame.x = figma.viewport.center.x;
    frame.y = figma.viewport.center.y;
    frame.resize(200, 200); frame.fills = [figma.util.solidPaint(colors.bg)]
    frame.layoutMode = 'VERTICAL';
    frame.layoutSizingVertical = 'HUG';
    frame.itemSpacing = 8;     frame.paddingLeft = 8; frame.paddingRight = 8; frame.paddingTop = 8; frame.paddingBottom = 8;
    frame.cornerRadius = 4;

    // The frame for the recipe
    const frameContent = figma.createFrame()
    frameContent.fills = [figma.util.solidPaint(colors.bg)]
    frameContent.layoutMode = 'VERTICAL'
    frameContent.layoutSizingVertical = 'HUG'
    frameContent.layoutSizingHorizontal = 'HUG'
    frameContent.itemSpacing = 4;
    frameContent.locked=true;

    // The text size info
    const titleText = figma.createText()
    titleText.characters = 'MY RECIPE';
    
    titleText.fontSize = 16
    titleText.fills = [figma.util.solidPaint(colors.text)]
    frame.appendChild(titleText);

  
    for (let i=0; i<settings.flows.length; i++){
        let flowFrame = figma.createFrame();
        flowFrame.fills = [figma.util.solidPaint(colors.bg)];
        flowFrame.layoutMode = 'HORIZONTAL';
        flowFrame.layoutSizingVertical = 'HUG';
        flowFrame.layoutSizingHorizontal = 'HUG';
        flowFrame.itemSpacing = 4;


        // Create the text with the index of the flow
            let idFrame = figma.createFrame();  idFrame.cornerRadius = 8;
            idFrame.fills = [figma.util.solidPaint(colors['bg-secondary'])];
            
            let textId = figma.createText();
            textId.characters = (i+1).toString();
            textId.fontSize = 8
            textId.fills = [figma.util.solidPaint(colors.text)];
            idFrame.appendChild(textId);
            idFrame.layoutMode = 'VERTICAL';idFrame.resize(16, 16);
            idFrame.counterAxisAlignItems = 'CENTER';
            idFrame.primaryAxisAlignItems = 'CENTER';
            flowFrame.appendChild(idFrame);

            // Create the text for the repeat #
            const repeat = figma.createText()
            repeat.characters = settings.flows[i].repeat+'x';
            repeat.fontSize = 8; repeat.resize(16, 16);
            repeat.textAlignHorizontal = 'CENTER'; repeat.textAlignVertical = 'CENTER';
            repeat.fills = [figma.util.solidPaint(colors.text)];
            flowFrame.appendChild(repeat)
            frameContent.appendChild(flowFrame);

            // Then we loop on the transformations
            for (let j=0; j<settings.flows[i].ops.length; j++){
                let op = settings.flows[i].ops[j];
                if (op.type==='Translation') {
                    let tr = figma.createNodeFromSvg(icons.translation); tr.resize(12, 12);
                  flowFrame.appendChild(tr);
                }
                if (op.type==='Rotation') {
                    let tr = figma.createNodeFromSvg(icons.rotation); tr.resize(12, 12);
                   flowFrame.appendChild(tr);
                }
                if (op.type==='Scale') {
                    let tr = figma.createNodeFromSvg(icons.scale); tr.resize(12, 12);
                    flowFrame.appendChild(tr);
                }
                if (op.type==='Opacity') {
                    let tr = figma.createNodeFromSvg(icons.opacity); tr.resize(12, 12);
                    flowFrame.appendChild(tr);
                }
            }

    }

    frame.appendChild(frameContent);

    // The text size info
    const saveText = figma.createText()
    
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    saveText.characters = `Recipe saved on ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()} : ${date.getMinutes()}`;
    saveText.fontSize = 6;
    saveText.fills = [figma.util.solidPaint(colors['text-secondary'])]
    frame.appendChild(saveText);

    
    return frame;

}