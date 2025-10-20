import {
	parsePathString,
	normalizePath,
	reversePath,
} from "svg-path-commander";

export function normalizePathWinding(input: string): string {
	const d = extractD(input);
	const segs = normalizePath(parsePathString(d));

	// Разбивка на подконтуры
	const contours: (string | number)[][][] = [];
	let cur: (string | number)[][] = [];
	for (const s of segs) {
		const cmd = s[0] as string;
		if (cmd === "M" && cur.length) {
			contours.push(cur);
			cur = [];
		}
		cur.push(s);
	}
	if (cur.length) contours.push(cur);

	// Геометрия каждого подконтура
	const geom = contours.map((c) => {
		const pts = contourVertices(c);
		return {
			segs: c,
			area: polygonArea(pts),
			pts,
			rep: centroid(pts),
		};
	});

	// Определяем «вложенность» лучевым тестом
	const fixed = geom.map((g, i) => {
		let containsCount = 0;
		for (let j = 0; j < geom.length; j++)
			if (j !== i) {
				if (pointInPolygon(g.rep, geom[j].pts)) containsCount++;
			}
		const shouldBeHole = containsCount % 2 === 1; // нечётная вложенность → дырка
		const wantCCW = !shouldBeHole;
		const isCCW = g.area > 0;

		const segs2 = wantCCW
			? isCCW
				? g.segs
				: reversePath(g.segs as any)
			: isCCW
				? reversePath(g.segs as any)
				: g.segs;

		return segs2;
	});

	const joined = fixed
		.map((c) => c.map((s) => s.join(" ")).join(" "))
		.join(" ");
	return sanitizePathD(joined); // precision см. выше
}

/* — helpers — */

function extractD(input: string): string {
	const m = input.match(/\sd="([^"]+)"/);
	return m ? m[1] : input.trim();
}

type P = { x: number; y: number };

function contourVertices(contour: (string | number)[][]): P[] {
	const pts: P[] = [];
	let sx = 0,
		sy = 0,
		px = 0,
		py = 0;
	for (const s of contour) {
		const cmd = s[0] as string;
		if (cmd === "M") {
			sx = +s[1];
			sy = +s[2];
			pts.push({ x: sx, y: sy });
			px = sx;
			py = sy;
		} else if (cmd === "L") {
			px = +s[1];
			py = +s[2];
			pts.push({ x: px, y: py });
		} else if (cmd === "H") {
			px = +s[1];
			pts.push({ x: px, y: py });
		} else if (cmd === "V") {
			py = +s[1];
			pts.push({ x: px, y: py });
		} else if (cmd === "C") {
			px = +s[5];
			py = +s[6];
			pts.push({ x: px, y: py });
		} else if (cmd === "Q") {
			px = +s[3];
			py = +s[4];
			pts.push({ x: px, y: py });
		} else if (cmd === "A") {
			const n = s.length;
			px = +s[n - 2];
			py = +s[n - 1];
			pts.push({ x: px, y: py });
		} else if (cmd === "Z") {
			pts.push({ x: sx, y: sy });
			px = sx;
			py = sy;
		}
	}
	return pts;
}

function polygonArea(pts: P[]): number {
	let a = 0;
	for (let i = 0; i < pts.length - 1; i++) {
		const p = pts[i],
			q = pts[i + 1];
		a += p.x * q.y - q.x * p.y;
	}
	return a / 2;
}

function centroid(pts: P[]): P {
	let x = 0,
		y = 0,
		n = Math.max(pts.length, 1);
	for (const p of pts) {
		x += p.x;
		y += p.y;
	}
	return { x: x / n, y: y / n };
}

function pointInPolygon(p: P, poly: P[]): boolean {
	// even-odd ray casting, допускаем последний = первый
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const xi = poly[i].x,
			yi = poly[i].y,
			xj = poly[j].x,
			yj = poly[j].y;
		const intersect =
			yi > p.y !== yj > p.y &&
			p.x < ((xj - xi) * (p.y - yi)) / (yj - yi + 1e-12) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}

export function sanitizePathD(raw: string, precision = 10): string {
	// Мягкая чистка, без агрессивного округления
	let d = raw
		.replace(/\s+xmlns="[^"]*"/g, "")
		.replace(/,([a-zA-Z])/g, " $1")
		.replace(/([a-zA-Z]),/g, "$1 ")
		.replace(/,/g, " ")
		.replace(/(\d)-(?=\d)/g, "$1 -")
		.replace(/(-?\d*\.?\d+)\s+([eE][+\-]?\d+)/g, "$1$2")
		.replace(/\s+/g, " ")
		.trim();

	if (precision != null) {
		d = d.replace(/[+\-]?\d*\.?\d+(?:[eE][+\-]?\d+)?/g, (num) => {
			const n = Number(num);
			if (!Number.isFinite(n)) return "0";
			const s = n.toFixed(precision).replace(/\.?0+$/, "");
			return s === "-0" ? "0" : s;
		});
	}

	return d
		.replace(/([a-zA-Z])(?=[+\-]?\d|\.)/g, "$1 ")
		.replace(/(\d)([a-zA-Z])/g, "$1 $2")
		.replace(/\s+/g, " ")
		.trim();
}
