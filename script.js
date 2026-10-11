let anhDaTao = null;
let duLieuAnhDaTao = null;
let tenAnhDaTao = "";

function hienThiTrangThaiAnh(thongBao) {
    const trangThai = document.getElementById("image-status");
    if (trangThai) {
        trangThai.textContent = thongBao;
        const imageActions = document.getElementById("image-actions");
        if (imageActions) {
            imageActions.hidden = false;
        }
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
        taiAnhDaTao();
        hienThiTrangThaiAnh("Trình duyệt này chưa hỗ trợ chia sẻ ảnh trực tiếp. Đã chuyển sang tải ảnh xuống.");
        return;
    }

    try {
        await navigator.share({
            files: [anhDaTao],
            title: "Phiếu thông tin khách hàng"
        });
        hienThiTrangThaiAnh("Đã mở bảng chia sẻ. Chọn Zalo, Messenger hoặc ứng dụng bạn muốn gửi ảnh.");
    } catch (error) {
        if (error && error.name === "AbortError") {
            hienThiTrangThaiAnh("Đã hủy chia sẻ. Ảnh vẫn có thể tải xuống bằng nút bên dưới.");
            return;
        }

        hienThiTrangThaiAnh("Không thể chia sẻ ảnh trong trình duyệt này. Đang chuyển sang tải ảnh xuống.");
        taiAnhDaTao();
    }
}

function taoAnh(loai) {

    const cauHoi = {
        "TÓC": [
            "Họ và tên – Tuổi",
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
            "Họ và tên – Tuổi",
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

    const numQuestions = loai === "DA" ? 30 : 25;
    const answers = [];
    for (let i = 1; i <= numQuestions; i++) {
        const el = document.getElementById("q" + i);
        answers.push(el && el.value.trim() !== "" ? el.value.trim() : "—");
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
        tenAnhDaTao = "Thong_tin_" + loai + ".png";
        anhDaTao = taoFileAnh(imgData, tenAnhDaTao);

        const imageActions = document.getElementById("image-actions");
        if (imageActions) {
            imageActions.hidden = false;
        }

        kichHoatTaiAnh(tenAnhDaTao, imgData);
        hienThiTrangThaiAnh("Đã tạo ảnh. Nếu chưa thấy ảnh tải xuống, hãy dùng nút TẢI ẢNH XUỐNG hoặc CHIA SẺ ẢNH.");

    };

    logo.onerror = function () {
        hienThiTrangThaiAnh("Không tải được logo nên chưa thể tạo ảnh. Vui lòng tải lại trang và thử lại.");
    };
}

function kiemTraVaTaoAnh(loai) {
    const batBuoc = ["q1", "q3", "q4"];

    for (let i = 0; i < batBuoc.length; i++) {
        const el = document.getElementById(batBuoc[i]);

        if (!el.value.trim()) {

            // Viền đỏ rõ ràng
            el.style.border = "2.5px solid #e53935";
            el.style.background = "#fff1f1";

            // Cuộn mượt đến câu hỏi bị thiếu
            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            // Focus vào ô nhập
            el.focus();

            // Rung nhẹ để gây chú ý
            el.animate([
                { transform: "translateX(0)" },
                { transform: "translateX(-5px)" },
                { transform: "translateX(5px)" },
                { transform: "translateX(0)" }
            ], {
                duration: 300
            });

            return; // ❌ DỪNG KHÔNG TẠO ẢNH
        } else {
            // Xoá viền lỗi nếu đã nhập
            el.style.border = "";
            el.style.background = "";
        }
    }

    // ✅ TẤT CẢ CÂU BẮT BUỘC ĐÃ ĐIỀN → TẠO ẢNH
    taoAnh(loai);
}

// ===============================
// LƯU TỰ ĐỘNG CÂU TRẢ LỜI
// ===============================
const tatCaCauHoi = document.querySelectorAll("textarea, input");

tatCaCauHoi.forEach(el => {
    el.addEventListener("input", () => {
        localStorage.setItem(el.id, el.value);
    });
});

// ===============================
// PHỤC HỒI DỮ LIỆU KHI MỞ TRANG
// ===============================
window.addEventListener("load", () => {
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
