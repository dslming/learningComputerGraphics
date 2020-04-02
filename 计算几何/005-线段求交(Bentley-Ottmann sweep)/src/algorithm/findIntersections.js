import Sweepline from './sweepline.js'
import Point from './Point.js'
import { utils } from './utils/index.js'
const Tree = window.AVLTree

/**
* @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
*/
export function findIntersections(segments) {
    var sweepline = new Sweepline('before');
    try {
        var queue = new Tree(utils.comparePoints, true),
            status = new Tree(utils.compareSegments.bind(sweepline), true),
            output = new Tree(utils.comparePoints, true);
    }
    catch (uwu) {
        if (!(/is not a constructor/i.test(uwu.message))) {
            throw uwu
        }
        var queue = new Tree.default(utils.comparePoints, true),
            status = new Tree.default(utils.compareSegments.bind(sweepline), true),
            output = new Tree.default(utils.comparePoints, true);
    }

    segments.forEach(function (segment) {
        segment.sort(utils.comparePoints);
        var begin = new Point(segment[0], 'begin'),
            end = new Point(segment[1], 'end');

        queue.insert(begin, begin);
        begin = queue.find(begin).key;
        begin.segments.push(segment);

        queue.insert(end, end);
    });

    while (!queue.isEmpty()) {
        var point = queue.pop();
        handleEventPoint(point.key, status, output, queue, sweepline);
    }

    return output.keys().map(function (key) {
        return [key.x, key.y];
    });
}

function handleEventPoint(point, status, output, queue, sweepline) {
    sweepline.setPosition('before');
    sweepline.setX(point.x);

    var Up = point.segments, // segments, for which this is the left end
        Lp = [],             // segments, for which this is the right end
        Cp = [];             // // segments, for which this is an inner point

    // step 2
    status.forEach(function (node) {
        var segment = node.key,
            segmentBegin = segment[0],
            segmentEnd = segment[1];

        // count right-ends
        if (Math.abs(point.x - segmentEnd[0]) < utils.EPS && Math.abs(point.y - segmentEnd[1]) < utils.EPS) {
            Lp.push(segment);
            // count inner points
        } else {
            // filter left ends
            if (!(Math.abs(point.x - segmentBegin[0]) < utils.EPS && Math.abs(point.y - segmentBegin[1]) < utils.EPS)) {
                if (Math.abs(utils.direction(segmentBegin, segmentEnd, [point.x, point.y])) < utils.EPS && utils.onSegment(segmentBegin, segmentEnd, [point.x, point.y])) {
                    Cp.push(segment);
                }
            }
        }
    });

    if ([].concat(Up, Lp, Cp).length > 1) {
        output.insert(point, point);
    };

    for (var j = 0; j < Cp.length; j++) {
        status.remove(Cp[j]);
    }

    sweepline.setPosition('after');

    for (var k = 0; k < Up.length; k++) {
        if (!status.contains(Up[k])) {
            status.insert(Up[k]);
        }
    }
    for (var l = 0; l < Cp.length; l++) {
        if (!status.contains(Cp[l])) {
            status.insert(Cp[l]);
        }
    }

    if (Up.length === 0 && Cp.length === 0) {
        for (var i = 0; i < Lp.length; i++) {
            var s = Lp[i],
                sNode = status.find(s),
                sl = status.prev(sNode),
                sr = status.next(sNode);

            if (sl && sr) {
                findNewEvent(sl.key, sr.key, point, output, queue);
            }

            status.remove(s);
        }
    } else {
        var UCp = [].concat(Up, Cp).sort(utils.compareSegments),
            UCpmin = UCp[0],
            sllNode = status.find(UCpmin),
            UCpmax = UCp[UCp.length - 1],
            srrNode = status.find(UCpmax),
            sll = sllNode && status.prev(sllNode),
            srr = srrNode && status.next(srrNode);

        if (sll && UCpmin) {
            findNewEvent(sll.key, UCpmin, point, output, queue);
        }

        if (srr && UCpmax) {
            findNewEvent(srr.key, UCpmax, point, output, queue);
        }

        for (var p = 0; p < Lp.length; p++) {
            status.remove(Lp[p]);
        }
    }
    return output;
}

function findNewEvent(sl, sr, point, output, queue) {
    var intersectionCoords = utils.findSegmentsIntersection(sl, sr),
        intersectionPoint;

    if (intersectionCoords) {
        intersectionPoint = new Point(intersectionCoords, 'intersection');

        if (!output.contains(intersectionPoint)) {
            queue.insert(intersectionPoint, intersectionPoint);
        }

        output.insert(intersectionPoint, intersectionPoint);
    }
}
