import { useEffect, useState } from 'react'
import { wrapText}  from '../utils.jsx'


function Corrector(props) {


    const drawErrors = (canvas, errors) => {
        const ctx = canvas.getContext('2d');
        errors.forEach(error => {
            const pos = error['position']
            const x = 5
            const y = parseInt(pos[1]) * canvas.height/100
            ctx.beginPath();
            ctx.strokeStyle = '#ff0000e1';
            ctx.moveTo(205, y);
            ctx.lineTo(205, y + 50);
            //ctx.rect(x, y, 200, 50);
            ctx.fillStyle = '#ff0000e1';
            ctx.fill();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'red';
            wrapText(ctx, error['error'], x+5, y+12, 200, 12)
            ctx.closePath();
            ctx.stroke();
        });
    }

    const drawEvaluations = (canvas, evaluations) => {
        const ctx = canvas.getContext('2d');
        evaluations.forEach(evaluation => {
            const pos = evaluation['position']
            const x = canvas.width - 200
            const y = parseInt(pos[1]) * canvas.height/100
            ctx.beginPath();
            ctx.strokeStyle = '#00ff00e1';
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 50);
            ctx.fillStyle = '#00ff00e1';
            ctx.fill();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            wrapText(ctx, evaluation['evaluation'], x+5, y+12, 200, 12)
            ctx.closePath();
            ctx.stroke();
        });
    }

    const drawPageResults = (canvas_id, results) => {

        const canvas = document.getElementById(canvas_id);
        if(!canvas) return
        console.log("draw on canvas" + canvas_id)
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = results.image;
        img.onload = () => {
            canvas.width = img.width + 400;
            canvas.height = img.height;
            console.log(canvas.width + " " + canvas.height)
            ctx.drawImage(img, 200, 0);
            drawErrors(canvas, results.errors)
            drawEvaluations(canvas, results.evaluations)
        }
    }

    const drawResults = (results) => {
        const cavnasContainer = document.getElementById("canvasPagesContainer")
        if(!cavnasContainer) {
            console.error("Canvas container not found")
            return
        }
        cavnasContainer.innerHTML = ""
        results.pages.map( (result, index) => {
            // append new canvas to div #canvasPagesContainer
            const cid = "page_" + String(index)
            const canvasNode = document.createElement("canvas");
            canvasNode.setAttribute('id', cid)
            canvasNode.setAttribute('style', "border: 1px solid red;")
            cavnasContainer.appendChild(canvasNode)
            result['image'] = props.images[index]
            drawPageResults(cid, result)
        })
    };

    useEffect(() => {
        if(!props.images || !props.results || props.results.length === 0) return;
        drawResults(props.results)
    }, [props.results]);

    return (
        <> 
        <div><b>Probabilità di svolgimento dall'intelligenza artificiale</b>:  {props.results.ai_generated}%</div>
        <div><b>Votazione: {props.results.vote}</b></div>
        <div><b>Valutazione</b>: {props.results.comment}</div>
        <div><b>Possibili miglioramenti</b>: {props.results.improvements}</div>
        <div id="canvasPagesContainer"></div>
        </>
    )
}

export default Corrector