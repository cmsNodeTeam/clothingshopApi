package com.dev.api.controller.upload;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.api.schema.upload.ReqUploadFile;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(tags = "File upload api", description = "File upload")
@RestController
@RequestMapping(value = "/api/file")
public class UploadController {

	@ApiOperation(value = "上传文件接口",  notes = "上传文件")
	@PostMapping("/upload")
	public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file, 
			ReqUploadFile params) {
		Map<String, Object> resp = new HashMap<>();
		
		if (file.isEmpty()) {
			resp.put("code", 0);
			resp.put("msg", "文件不能为空");
			return resp;
		}
		
		String fileName = file.getOriginalFilename();
		System.out.println(fileName);
		
		String path = "./upload/" + fileName;
		// 这个路径如果加.那么生成在src同级目录下,如果不加.,那么生成在d盘下
        File dest = new File(path);
//        try {
//			String path2 = ResourceUtils.getURL("classpath:").getPath();
//			System.out.println(path2);
//		} catch (FileNotFoundException e1) {
//			e1.printStackTrace();
//		}
        //判断文件是否已经存在
        if (dest.exists()) {
        	resp.put("code", 0);
			resp.put("msg", "文件已存在");
			return resp;
        }

        //判断文件父目录是否存在
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdir();
        }

        try {
        	FileCopyUtils.copy(file.getInputStream(), Files.newOutputStream(dest.toPath()));
        } catch (IOException e) {
        	e.printStackTrace();
        	resp.put("code", 0);
			resp.put("msg", e.getMessage());
			return resp;
        }
		
		// 上传文件时加入其它参数的写法
		System.out.println("Name:" + params.getName());
		System.out.println("Age" + params.getAge());
		
		resp.put("code", 1);
		resp.put("msg", "上传成功");
		return resp;
	}
}
