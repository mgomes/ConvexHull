// Copyright 2001, softSurfer (www.softsurfer.com)
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
// http://softsurfer.com/Archive/algorithm_0203/algorithm_0203.htm
// Assume that a class is already given for the object:
//    Point with coordinates {float x, y;}
//===================================================================

// isLeft(): tests if a point is Left|On|Right of an infinite line.
//    Input:  three points P0, P1, and P2
//    Return: >0 for P2 left of the line through P0 and P1
//            =0 for P2 on the line
//            <0 for P2 right of the line

function sortPointX(a, b) {
    return a.lng() - b.lng();
}
function sortPointY(a, b) {
    return a.lat() - b.lat();
}

function isLeft(P0, P1, P2) {    
    return (P1.lng() - P0.lng()) * (P2.lat() - P0.lat()) - (P2.lng() - P0.lng()) * (P1.lat() - P0.lat());
}
//===================================================================

// chainHull_2D(): A.M. Andrew's monotone chain 2D convex hull algorithm
// http://softsurfer.com/Archive/algorithm_0109/algorithm_0109.htm
// 
//     Input:  P[] = an array of 2D points 
//                   presorted by increasing x- and y-coordinates
//             n = the number of points in P[]
//     Output: H[] = an array of the convex hull vertices (max is n)
//     Return: the number of points in H[]


function chainHull_2D(P, n, H) {
    // the output array H[] will be used as the stack
    var bot = 0,
    ttop = (-1); // indices for bottom and top of the stack
    var i; // array scan index
    // Get the indices of points with min x-coord and min|max y-coord
    var minmin = 0,
        minmax;
        
    var xmin = P[0].lng();
    for (i = 1; i < n; i++) {
        if (P[i].lng() != xmin) {
            break;
        }
    }
    
    minmax = i - 1;
    if (minmax == n - 1) { // degenerate case: all x-coords == xmin 
        H[++ttop] = P[minmin];
        if (P[minmax].lat() != P[minmin].lat()) // a nontrivial segment
            H[++ttop] = P[minmax];
        H[++ttop] = P[minmin]; // add polygon endpoint
        return ttop + 1;
    }

    // Get the indices of points with max x-coord and min|max y-coord
    var maxmin, maxmax = n - 1;
    var xmax = P[n - 1].lng();
    for (i = n - 2; i >= 0; i--) {
        if (P[i].lng() != xmax) {
            break; 
        }
    }
    maxmin = i + 1;

    // Compute the lower hull on the stack H
    H[++ttop] = P[minmin]; // push minmin point onto stack
    i = minmax;
    while (++i <= maxmin) {
        // the lower line joins P[minmin] with P[maxmin]
        if (isLeft(P[minmin], P[maxmin], P[i]) >= 0 && i < maxmin) {
            continue; // ignore P[i] above or on the lower line
        }
        
        while (ttop > 0) { // there are at least 2 points on the stack
            // test if P[i] is left of the line at the stack top
            if (isLeft(H[ttop - 1], H[ttop], P[i]) > 0) {
                break; // P[i] is a new hull vertex
            }
            else {
                ttop--; // pop top point off stack
            }
        }
        
        H[++ttop] = P[i]; // push P[i] onto stack
    }

    // Next, compute the upper hull on the stack H above the bottom hull
    if (maxmax != maxmin) { // if distinct xmax points
        H[++ttop] = P[maxmax]; // push maxmax point onto stack
    }
    
    bot = ttop; // the bottom point of the upper hull stack
    i = maxmin;
    while (--i >= minmax) {
        // the upper line joins P[maxmax] with P[minmax]
        if (isLeft(P[maxmax], P[minmax], P[i]) >= 0 && i > minmax) {
            continue; // ignore P[i] below or on the upper line
        }
        
        while (ttop > bot) { // at least 2 points on the upper stack
            // test if P[i] is left of the line at the stack top
            if (isLeft(H[ttop - 1], H[ttop], P[i]) > 0) { 
                break;  // P[i] is a new hull vertex
            }
            else {
                ttop--; // pop top point off stack
            }
        }
        
        if (P[i].lng() == H[0].lng() && P[i].lat() == H[0].lat()) {
            return ttop + 1; // special case (mgomes)
        }
        
        H[++ttop] = P[i]; // push P[i] onto stack
    }
    
    if (minmax != minmin) {
        H[++ttop] = P[minmin]; // push joining endpoint onto stack
    }
    
    return ttop + 1;
}
