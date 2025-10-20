import {
	parsePathString,
	normalizePath,
	reversePath,
} from "svg-path-commander";

export function normalizePathWinding(d: string) {
	const segs = normalizePath(parsePathString(d)); // делаем абсолютные сегменты
	// посчитаем ориентированную площадь (Green’s theorem) по дискретизации
	const area = signedArea(segs);
	// хотим, чтобы все были CCW (area > 0). Если отрицательная — разворачиваем.
	const path =
		area < 0
			? reversePath(segs)
					.map((s) => s.join(" "))
					.join(" ")
			: segs.map((s) => s.join(" ")).join(" ");

	return sanitizePathD(path);
}

function signedArea(segs: (string | number)[][]) {
	// грубая дискретизация Безье -> полигона для оценки площади
	const pts: { x: number; y: number }[] = [];
	let x = 0,
		y = 0;
	const push = (nx: number, ny: number) => {
		pts.push({ x: nx, y: ny });
		x = nx;
		y = ny;
	};

	// берём только вершины (для точности можно добавить дискретизацию кривых)
	for (const s of segs) {
		const cmd = s[0] as string;
		if (cmd === "M" || cmd === "L") push(s[1] as number, s[2] as number);
		else if (cmd === "C") push(s[5] as number, s[6] as number);
		else if (cmd === "Q") push(s[3] as number, s[4] as number);
		else if (cmd === "Z") {
			/* close */
		}
	}
	let a = 0;
	for (let i = 0; i < pts.length; i++) {
		const p = pts[i],
			q = pts[(i + 1) % pts.length];
		a += p.x * q.y - q.x * p.y;
	}
	return a / 2;
}

function sanitizePathD(d: string) {
	return (
		d
			// запятая перед/после буквы команды → пробел
			.replace(/,([a-zA-Z])/g, " $1")
			.replace(/([a-zA-Z]),/g, "$1 ")
			// любые оставшиеся запятые → пробелы
			.replace(/,/g, " ")
			.replace(/\s+/g, " ")
			.replace(/(\d)([a-zA-Z])/g, "$1 $2")
			.replace(/(-?\d*\.?\d+)\s+([eE][+-]?\d+)/g, "$1$2")
			// (опционально) конвертировать научную нотацию в обычное число
			.replace(/-?\d*\.?\d+[eE][+-]?\d+/g, (m) => {
				const n = Number(m);
				return Object.is(n, -0) ? "0" : String(n);
			})
			.trim()
	);
}
