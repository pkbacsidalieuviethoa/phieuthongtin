let anhDaTao = null;
let duLieuAnhDaTao = null;
let tenAnhDaTao = "";

function hienThiTrangThaiAnh(thongBao) {
    const trangThai = document.getElementById("image-status");
    if (trangThai) {
        trangThai.textContent = thongBao;
    }
}

function kichHoatTaiAnh(fileName, imageUrl) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function taoTenFileAnh(tenKhachHang, loai) {
    const tenAnToan = tenKhachHang
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "Khach_hang";
    const ngayGio = new Date();
    const dinhDangSo = so => String(so).padStart(2, "0");
    const mocThoiGian = [
        ngayGio.getFullYear(),
        dinhDangSo(ngayGio.getMonth() + 1),
        dinhDangSo(ngayGio.getDate())
    ].join("") + "_" + [
        dinhDangSo(ngayGio.getHours()),
        dinhDangSo(ngayGio.getMinutes()),
        dinhDangSo(ngayGio.getSeconds())
    ].join("");

    return "Thong_tin_" + tenAnToan + "_" + loai + "_" + mocThoiGian + ".png";
}

function moHopThoaiChiaSe() {
    const dialogue = document.getElementById("image-share-dialog");
    if (!dialogue) {
        return;
    }

    if (typeof dialogue.showModal === "function") {
        try {
            dialogue.showModal();
            return;
        } catch (error) {
            // Fall back to an in-page modal if native dialog opening is unavailable.
        }
    }

    dialogue.classList.add("is-fallback-modal");
    document.body.classList.add("share-dialog-fallback");
    dialogue.setAttribute("open", "");
    if (!dialogue.dataset.escapeHandlerAdded) {
        dialogue.addEventListener("keydown", event => {
            if (event.key === "Escape" &&
                dialogue.classList.contains("is-fallback-modal")) {
                event.preventDefault();
                dongHopThoaiChiaSe();
            }
        });
        dialogue.dataset.escapeHandlerAdded = "true";
    }
    const shareButton = dialogue.querySelector(".share-primary");
    if (shareButton) {
        shareButton.focus();
    }
}

function dongHopThoaiChiaSe() {
    const dialogue = document.getElementById("image-share-dialog");
    if (dialogue && dialogue.open) {
        if (dialogue.classList.contains("is-fallback-modal")) {
            dialogue.classList.remove("is-fallback-modal");
            document.body.classList.remove("share-dialog-fallback");
            dialogue.removeAttribute("open");
        } else {
            dialogue.close();
        }
    }
}

function taoFileAnh(dataUrl, fileName) {
    if (typeof File !== "function") {
        return null;
    }

    const parts = dataUrl.split(",");
    const mimeType = parts[0].match(/data:(.*?);base64/)[1];
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], fileName, { type: mimeType });
}

function taiAnhDaTao() {
    if (!duLieuAnhDaTao) {
        hienThiTrangThaiAnh("Vui lòng tạo ảnh trước khi tải xuống.");
        return;
    }

    const imageUrl = anhDaTao ? URL.createObjectURL(anhDaTao) : duLieuAnhDaTao;
    kichHoatTaiAnh(tenAnhDaTao, imageUrl);
    if (anhDaTao) {
        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 60000);
    }
    hienThiTrangThaiAnh("Đã yêu cầu tải ảnh xuống. Nếu trình duyệt không tải, hãy thử mở trang bằng trình duyệt của điện thoại.");
}

async function chiaSeAnh() {
    if (!duLieuAnhDaTao) {
        hienThiTrangThaiAnh("Vui lòng tạo ảnh trước khi chia sẻ.");
        return;
    }

    let coTheChiaSeTep = false;
    if (anhDaTao &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function") {
        try {
            coTheChiaSeTep = navigator.canShare({ files: [anhDaTao] });
        } catch (error) {
            coTheChiaSeTep = false;
        }
    }

    if (!coTheChiaSeTep) {
        hienThiTrangThaiAnh("Trình duyệt này chưa hỗ trợ chia sẻ ảnh trực tiếp. Hãy chọn TẢI ẢNH XUỐNG; trên điện thoại, bạn có thể mở ảnh đã tải trong Ảnh/Thư viện để chia sẻ.");
        return;
    }

    try {
        await navigator.share({
            files: [anhDaTao],
            title: "Phiếu thông tin khách hàng",
            text: "Phiếu thông tin khách hàng"
        });
        dongHopThoaiChiaSe();
    } catch (error) {
        if (error && error.name === "AbortError") {
            hienThiTrangThaiAnh("Đã hủy chia sẻ. Ảnh vẫn có thể tải xuống bằng nút bên dưới.");
            return;
        }

        hienThiTrangThaiAnh("Không thể chia sẻ ảnh trong trình duyệt này. Hãy thử mở trang bằng Chrome hoặc Safari, hoặc chọn TẢI ẢNH XUỐNG để chia sẻ từ Ảnh/Thư viện.");
    }
}

function taoAnh(loai) {

    const cauHoi = {
        "TÓC": [
            "Họ và tên",
            "Tuổi",
            "Nghề nghiệp hiện tại (kể cả công việc làm thêm)",
            "Số điện thoại liên hệ",
            "Ngày tháng năm sinh",
            "Địa chỉ thường trú",
            "Lý do đi khám tóc / da đầu",
            "Có mang thai / cho con bú / dự định mang thai trong 6 tháng?",
            "Có bệnh buồng trứng đa nang hoặc tuyến giáp không?",
            "Có mất ngủ hoặc tiền sử bệnh tâm thần kinh vd: trầm cảm, lo âu?",
            "Hiện tại có bệnh gì không, có đang uống thuốc điều trị bệnh nào không?",
            "Có bệnh lý về máu thiếu máu, máu chảy không đông không?",
            "Có rối loạn chức năng gan - thận - mỡ máu - đường máu không?",
            "Trong gia đình có ai mắc bệnh giống mình không?",
            "Trước đây hoặc hiện tại có dùng thuốc bổ không?",
            "Có thường xuyên ăn nhiều đồ ngọt, béo, sữa và các chế phẩm từ sữa không?",
            "Có hay tnức khuya, stress, chất kích thích, vd: rượu bia, thuốc lá?",
            "Có sử dụng bột tăng cơ / thực phẩm thể hình trước đây hoặc hiện tại không?",
            "Đã từng điều trị tóc / da đầu chưa? [điều trị bao nhiêu đợt, mỗi đợt thời gian bao lâu]. Hiện tại đang điều trị hay ngừng [nếu đã ngừng thì ngừng bao lâu]?",
            "Da đầu có ngứa không? [vị trí ngứa, ngứa ban ngày hay ban đêm, xuất hiện bao lâu]",
            "Da đầu có đau, bỏng rát không?",
            "Da đầu có gàu hoặc khô, bong tróc không?",
            "Vị trí rụng tóc, rụng nhiều ở vùng nào, rụng theo mảng hay xen kẽ?",
            "Mức độ rụng tóc ít hay nhiều?",
            "Có vuốt, kéo tóc hoặc đội mũ thường xuyên không?",
            "Có theo chế độ ăn kiêng hoặc kiêng thực phẩm nào không?"
        ],
        "DA": [
            "Họ và tên",
            "Tuổi",
            "Nghề nghiệp hiện tại",
            "Số điện thoại liên hệ",
            "Ngày tháng năm sinh",
            "Địa chỉ thường trú",
            "Lý do đi khám da: Mụn, thâm, sẹo, nhạy cảm, lão hoá, nám?",
            "Tuổi bắt đầu bị mụn lần đầu tiên, đến nay bao nhiêu năm?",
            "Có mang thai / cho con bú / dự định mang thai trong 6 tháng?",
            "Có bệnh lý về tuyến giáp không?",
            "Có mất ngủ hoặc tiền sử bệnh tâm thần kinh vd: trầm cảm, lo âu?",
            "Hiện tại có mắc bệnh gì không, có đang uống thuốc điều trị bệnh nào không?",
            "Có bệnh lý về máu thiếu máu, máu chảy không đông không?",
            "Có rối loạn chức năng gan - thận - mỡ máu - đường máu không?",
            "Trong gia đình có ai mắc bệnh giống mình không?",
            "Có thường xuyên ăn nhiều đồ ngọt, béo, sữa và các chế phẩm từ sữa không?",
            "Có hay tnức khuya, stress, chất kích thích, vd: rượu bia, thuốc lá?",
            "Có sử dụng bột tăng cơ / thực phẩm thể hình trước đây hoặc hiện tại không?",
            "Đã từng dùng kháng sinh điều trị mụn chưa [bao nhiêu đợt, thời gian bao lâu]? Hiện đang uống hay đã ngừng [nếu đã ngừng thì ngừng được bao lâu]?",
            "Đã từng uống Isotretinoin điều trị mụn hoặc bệnh khác? [bao nhiêu đợt, thời gian bao lâu]? Hiện đang uống hay đã ngừng [nếu đã ngừng thì ngừng được bao lâu]?",
            "Tiền sử HIV, viêm gan B, viêm gan C,...?",
            "Da có ngứa không?",
            "Da có châm chích, bỏng rát, căng kéo không?",
            "Da có khô, bong tróc không?",
            "Da có mỏng, đỏ, tăng sinh mạch máu không?",
            "Da có mụn ẩn mụn đầu đen?",
            "Da có mụn viêm, có mủ?",
            "Da có nang cục, áp xe?",
            "Da có đều màu không, có sạm không, sạm bao lâu, nặng hay nhẹ?",
            "Da có vết thâm không, nguyên nhân do mụn hay lấy mụn, có tồn tại dai dẳng không?",
            "Da có sẹo không, nhiều hay ít?"
        ]
    };

    const numQuestions = cauHoi[loai].length;
    const answers = [];
    for (let i = 1; i <= numQuestions - 1; i++) {
        const el = document.getElementById("q" + i);
        const answer = el && el.value.trim() !== "" ? el.value.trim() : "—";
        answers.push(answer);
        if (i === 1) {
            const age = document.getElementById("age").value.trim();
            answers.push(age || "—");
        }
    }

    /* ===== TÍNH CHIỀU CAO ẢNH ===== */
    const lineHeight = 40;
    const titleHeight = 140;
    const linesPerQA = 3; // 1 câu hỏi + 1 trả lời + khoảng cách
    const totalHeight = titleHeight + (numQuestions * linesPerQA * lineHeight) + 120;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = totalHeight;

    /* ===== NỀN ===== */
    const gradient = ctx.createLinearGradient(0, 0, 0, totalHeight);
    gradient.addColorStop(0, "#f8f9fa");
    gradient.addColorStop(1, "#e9ecef");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Viền ngoài
    ctx.strokeStyle = "#00796b";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    const x = 80;
    let y = 100;
    const maxWidth = canvas.width - 160;

    /* ===== LOGO ===== */
    const logo = new Image();
    logo.src = "images/logo.png";
    logo.onload = function () {
        ctx.drawImage(logo, canvas.width - 150, 20, 120, 120);

        /* ===== TIÊU ĐỀ ===== */
        ctx.font = "bold 40px 'Montserrat', sans-serif";
        ctx.fillStyle = "#00796b";
        ctx.fillText("PHIẾU THÔNG TIN KHÁCH HÀNG – " + loai, x, y);
        y += 80;

        ctx.font = "24px 'Roboto', sans-serif";
        ctx.fillStyle = "#37474f";

        function drawText(text, isQuestion = false) {
            let words = text.split(" ");
            let line = "";

            for (let w of words) {
                let test = line + w + " ";
                if (ctx.measureText(test).width > maxWidth) {
                    ctx.fillText(line, x, y);
                    line = w + " ";
                    y += lineHeight;
                } else {
                    line = test;
                }
            }
            ctx.fillText(line, x, y);
            y += lineHeight;
        }

        /* ===== VẼ CÂU HỎI ===== */
        for (let i = 0; i < numQuestions; i++) {
            ctx.font = "bold 22px 'Roboto', sans-serif";
            ctx.fillStyle = "#00796b";
            drawText((i + 1) + ". " + cauHoi[loai][i]);

            ctx.font = "20px 'Roboto', sans-serif";
            ctx.fillStyle = "#37474f";
            drawText("→ " + answers[i]);
            y += 20;
        }

        const imgData = canvas.toDataURL("image/png");
        duLieuAnhDaTao = imgData;
        tenAnhDaTao = taoTenFileAnh(document.getElementById("q1").value.trim(), loai);
        anhDaTao = taoFileAnh(imgData, tenAnhDaTao);

        kichHoatTaiAnh(tenAnhDaTao, imgData);
        hienThiTrangThaiAnh("Ảnh đã sẵn sàng. Chọn chia sẻ với phòng khám hoặc tải ảnh xuống thêm lần nữa nếu cần.");
        moHopThoaiChiaSe();

    };

    logo.onerror = function () {
        hienThiTrangThaiAnh("Không tải được logo nên chưa thể tạo ảnh. Vui lòng tải lại trang và thử lại.");
    };
}

function kiemTraVaTaoAnh(loai) {
    const batBuoc = ["q1", "age", "q3", "q4"];

    for (let i = 0; i < batBuoc.length; i++) {
        const el = document.getElementById(batBuoc[i]);
        const thongBaoLoi = kiemTraDinhDangTruong(el.id);
        hienThiLoiTruong(el, thongBaoLoi);

        if (thongBaoLoi) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            el.focus();
            if (typeof el.animate === "function") {
                el.animate([
                    { transform: "translateX(0)" },
                    { transform: "translateX(-5px)" },
                    { transform: "translateX(5px)" },
                    { transform: "translateX(0)" }
                ], { duration: 300 });
            }
            return;
        }
    }

    taoAnh(loai);
}

function kiemTraDinhDangTruong(id) {
    const el = document.getElementById(id);
    const value = el.value.trim();
    if (!value) {
        return "Đây là mục bắt buộc. Vui lòng nhập thông tin.";
    }

    if (id === "q1" && value.length < 2) {
        return "Họ và tên cần có ít nhất 2 ký tự.";
    }

    if (id === "age" && (!/^\d{1,3}$/.test(value) || Number(value) > 120)) {
        return "Nhập tuổi bằng số từ 0 đến 120 (VD: 28).";
    }

    if (id === "q3" && !/^0\d{9}$/.test(value)) {
        return "Số điện thoại cần gồm 10 chữ số và bắt đầu bằng 0 (VD: 0912345678).";
    }

    if (id === "q4") {
        const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) {
            return "Nhập ngày sinh theo định dạng DD/MM/YYYY (VD: 15/08/1995).";
        }

        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDate.getFullYear() !== year ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getDate() !== day ||
            birthDate > today) {
            return "Ngày sinh không hợp lệ hoặc nằm trong tương lai.";
        }
    }

    return "";
}

function hienThiLoiTruong(el, thongBao) {
    const errorMessage = document.getElementById(el.id + "-error");
    el.setAttribute("aria-invalid", thongBao ? "true" : "false");
    if (errorMessage) {
        errorMessage.textContent = thongBao;
        errorMessage.hidden = !thongBao;
    }
}

// ===============================
// LƯU TỰ ĐỘNG CÂU TRẢ LỜI
// ===============================
const tatCaCauHoi = document.querySelectorAll("textarea, input");

tatCaCauHoi.forEach(el => {
    el.addEventListener("input", () => {
        localStorage.setItem(el.id, el.value);
        if (el.classList.contains("bat-buoc") &&
            el.getAttribute("aria-invalid") === "true") {
            hienThiLoiTruong(el, kiemTraDinhDangTruong(el.id));
        }
    });

    if (el.classList.contains("bat-buoc")) {
        el.addEventListener("blur", () => {
            hienThiLoiTruong(el, kiemTraDinhDangTruong(el.id));
        });
    }
});

// ===============================
// PHỤC HỒI DỮ LIỆU KHI MỞ TRANG
// ===============================
window.addEventListener("load", () => {
    const oldNameAndAge = localStorage.getItem("q1");
    if (!localStorage.getItem("age") && oldNameAndAge) {
        const match = oldNameAndAge.match(/^(.+?)\s*[–-]\s*(\d{1,3})\s*tuổi$/i);
        if (match && Number(match[2]) <= 120) {
            localStorage.setItem("q1", match[1].trim());
            localStorage.setItem("age", match[2]);
        }
    }

    tatCaCauHoi.forEach(el => {
        const savedValue = localStorage.getItem(el.id);
        if (savedValue !== null) {
            el.value = savedValue;
        }
    });
    
});

function xoaDuLieu() {
    if (confirm("Xoá toàn bộ thông tin đã nhập?")) {
        localStorage.clear();
        location.reload();
    }
}
